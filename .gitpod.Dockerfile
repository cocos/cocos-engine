FROM gitpod/workspace-full

RUN bash -c ". ~/.nvm/nvm-lazy.sh && npm install -g gulp"
