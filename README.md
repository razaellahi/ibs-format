# What is this ?

Format the text like bold, italic, strike, and more by applying HTML tags.

# Demo

<a href="https://stackblitz.com/edit/angular-ivy-unjrxq?file=src%2Fapp%2Fapp.component.ts">CLICK HERE</a>

# Installation

```bash
npm i ibs-format --save
```

# Usage

```js
import { ibsFormat } from 'ibs-format';
```

 The function 'ibsFormat' needs two arguments.
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
var myText = ibsFormat(myText, tagArray);
```

 The function will return the result with tags.

`Once upon a time, there was a <b>thristy</b> <strike><i>crow</i></strike>.`


HTML...

`<p [innerHTML]="myText"></p>`


The result will...

Once upon a time, there was a <b>thristy</b> <strike><i>crow</i></strike>.


## Precautions

* Don't change the index positioning.
* The function does not supports double or multiple identifiers rather than double asterisks '**'.
* Don't use same identifiers for multiple tags.

