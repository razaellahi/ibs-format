# What is this ?

Format the text like bold, italic, strike, and more by applying HTML tags also detect links in text and convert them to HTML `<a>` tags.

# Demo

<a href="https://stackblitz.com/edit/angular-ivy-pueiy9?file=src%2Fapp%2Fapp.component.ts" target='_blank'>CLICK HERE</a>

# Installation

```bash
npm i ibs-format --save
```

# Usage

```js
import { ibsFormat } from 'ibs-format';
```

 For formatting the function 'ibsFormat' needs two arguments.
   1) the text with identifiers in the first argument, in the form of string.
   2) tags and identifiers in the second argument, in the form of string array.

```js
var myText = "Once upon a time, there was a *thristy* ~_crow_~."
```

In the array, the tag symbols in the first index and their identifier in the second index.

```js
var tagArray = [['b','*'],['i','_'],['strike','~']];
```

 * Here symbol, 'b' is using for 'bold', 'i' for 'italic' and 'strike' for 'strike' tag.
 * The user can use as many tags and their identifiers of his own choice.
 * Now the function will look like.

```js
 myText = ibsFormat(myText, tagArray);
```

 ### The function will return the result with tags

`Once upon a time, there was a <b>thristy</b> <strike><i>crow</i></strike>.`


### HTML

`<p [innerHTML]="myText"></p>`


### The result will

Once upon a time, there was a <b>thristy</b> <strike><i>crow</i></strike>.


# Auto detect links in text

For auto detecting links in to the text and converting them to HTML `<a>` tags, the function 'ibsFormat' needs three arguments
 * To enable auto detecting links create an object and set its 'detectLinks' property to true.
 * You can also specify the target of the links by creating a property 'target' in the object, it is optional with default value '_self'.
 * The value of 'target' property can be set to, '_blank', '_self', '_parent', '_top'.
 * Put the object in third argument.
 Like:

 ```js
 var myText = "The *best* website for learning _JS_ is https://www.w3schools.com/ and my email is info@myemail.com."

 var tagArray = [['b','*'],['i','_'],['strike','~']];

 var obj = {detectLinks: true, target: '_blank'};

 myText = ibsFormat(myText, tagArray, obj);
 ```

### The function will return

````
The <b>best</b> website for learning <i>JS</i> is <a href='https://www.w3schools.com/' target='_blank'>https://www.w3schools.com/</a>
and my email is <a href='mailto:info@myemail.com' target='_blank'>info@myemail.com</a>.
````

### The result will

The <b>best</b> website for learning <i>JS</i> is <a href='https://www.w3schools.com/' target='_blank'>https://www.w3schools.com/</a>
and my email is <a href='mailto:info@myemail.com' target='_blank'>info@myemail.com</a>.


### In order to skip the text formatting set the second argument null, like:

```js
myText = ibsFormat(myText, null , obj);
```

# Precautions

* Don't change the index positioning.
* The function does not supports double or multiple identifiers rather than double asterisks '**'.
* Don't use same identifiers for multiple tags.

