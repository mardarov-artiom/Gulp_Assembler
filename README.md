## Installation:

```Note: if you want to use less - go to feature/less branch in project repo```

### Project is based on  [Node Package Manager (npm)](https://www.npmjs.com/).

**Note: To use [npm](https://www.npmjs.com/) check if  [Node.js](https://nodejs.org/en/) is installed.**

If node.js and npm are installed, run the following commands:

Install gulp-cli globally

```
npm install --global gulp-cli
```
then

```
npm install or npm i
```

After all dependencies are installed, **run** one of the commands below:

---

You can choose which preprocessor to use `Sass` or `Less`.<br>
Uncomment functions and declarations in `gulpfile.js` in the project root.<br>
also rename your styles folder in project, and edit `path` variable.

---

## Available Scripts:

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.
Open http://localhost:3000 to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

---

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles application in production mode and optimizes the build for the best performance.

Your app is ready to be deployed!

---

### `npm run clean`

Deletes the `build` folder

---

For more information about how to include / import files check 

[gulp-include plugin](https://www.npmjs.com/package/gulp-include)

## License

MIT © [Artiom Mardarov]()