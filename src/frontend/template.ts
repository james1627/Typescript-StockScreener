const template = (appString: string) => {
  return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>My React App</title>
        </head>
        <body>
          <div id="root">${appString}</div>
          <script src="/bundle.js"></script>
        </body>
      </html>
    `;
};

export default template;
