# App

## Chat screen states (landing)

0. Error
1. Rendering
2. Loading chat history
3. Chat history loaded
4. Ready
   - History is empty
   - History has one or more items

## Chat user states (chat interaction)

0. Error
1. Idle
2. Typing
3. Paused (buffer dirty, not typing)
4. Sending (postExchange waiting)
5. Message posted (postExchange part1 received)
6. Reasoning (postExchange part2 streaming)
7. Answer (postExchange part3 streaming)
8. Done (postExchange end of stream)


