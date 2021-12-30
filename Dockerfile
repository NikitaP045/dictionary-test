FROM node:7.5-slim

COPY server.js /server.js
COPY graph.png /graph.png

CMD node /server.js
