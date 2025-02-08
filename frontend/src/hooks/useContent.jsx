import isComponent from '@utils/isComponent.js';
import Logger from '@utils/Logger.js';
import stringToTemplate from '@utils/stringToTemplate.js';
import merge from 'mout/object/merge';
import { renderToString } from 'react-dom/server';

const DEFAULT_LOCALE = 'en';

/**
 * Usage)
 *
 *  My.jsx
 *  ------
 *  import GlobalContent from '@content/Global.yaml';
 *  import MyContent from './My.yaml';
 *
 *  export default function My(props) {
 *    const c = useContent(GlobalContent, MyContent);
 *
 *    return (
 *      <p>{c.Greeting({ name: "World" })}</p>
 *    );
 *  }
 *
 * Keep in mind that the content rendered as a React component will render
 * more frequently as the parent component's props change.
 *
 *  Global.yaml
 *  --------
 *  en:
 *    Greeting: Hello, ${name}!
 *  es:
 *    Greeting: ¡Hola, ${name}!
 *
 *  My.yaml
 *  -------
 *  en:
 *    Greeting: Hi, ${name}!
 *
 * In above example, My.yaml will generally supersede Global.yaml while giving
 * localized content precedence.
 *
 * A user in 'en' locale (default) will see Hi, World!
 * A user in 'es' locale will see ¡Hola, World!
 * A user in 'de' locale will see Hi, World!
 *
 * This is because there is en specific content in My.yaml overriding Global.yaml,
 * but for es locale, My.yaml does not have any es specific content to override
 * the one provided by Global.yaml.
 */
export default function useContent(...contentList) {
  const logger = new Logger('useContent');
  const [lang] = navigator.language.split('-');

  const defaultContent = contentList.reduce(
    (result, item) => merge(result, item[DEFAULT_LOCALE]),
    {},
  );

  const localizedContent = contentList.reduce(
    (result, item) => merge(result, item[lang]),
    {},
  );

  // Localized content, if one exists, supersedes the default content.
  const content = merge(defaultContent, localizedContent);
  return createContentProxy(content);

  // Private methods

  function createContentProxy(object) {
    return new Proxy(object, {
      get(target, contentKey) {
        if (contentKey in target) {
          const contentValue = target[contentKey];

          if (contentValue && typeof contentValue === 'object') {
            return createContentProxy(target[contentKey]);
          }

          return (props) =>
            renderContent(target[contentKey], { ...object, ...props });
        }

        logger.warn(contentKey);
        return () => contentKey;
      },
    });
  }

  function renderContent(string, props) {
    const values =
      props &&
      Object.entries(props).reduce((results, [key, value]) => {
        if (isComponent(value)) {
          results[key] = renderToString(value);
        } else {
          results[key] = value;
        }
        return results;
      }, {});

    return stringToTemplate(string, values);
  }
}
