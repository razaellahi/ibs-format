# Description

Text formatting in Javascript. Detect the user-defined identifiers in the text and convert them into HTML tags like bold, italic, strike, and many more having XSS (Cross-site scripting) security with escaping functionality, also detect the links like URLs, email, and IP addresses and wrap them into Anchor tag `<a>` with also other user define formatting.

## Table of Contents
- [Online Demo](#online-demo)
- [Supported browsers](#browsers)
- [Installation](#installation)
- [Usage](#usage)
- [Text Formatting](#text-formatting)
- [Links Detecting](#links-detecting)
- [Cross Site Scripting (XSS)](#cross-site-scripting-(xss))
- [Format the text at run time using custom Pipe](#format-the-text-at-run-time-using-custom-pipe)
- [Use the external 'ngx-linkifyjs' library for detecting the links](#use-the-external-'ngx-linkifyjs'-library-for-detecting-the-links)
- [Precautions](#precautions)

<a name="online-demo"/>

# Online Demo

<a href="https://stackblitz.com/edit/angular-ivy-up1fwx?file=src%2Fapp%2Fcustom-pipe.pipe.ts" target='_blank'>CLICK HERE</a>

<a name="browsers"/>

# Supported browsers

Fully supported and tested, over Google Chrome, Microsoft Edge, Mozilla Firefox and Internet Explorer 11.

<a name="installation"/>

# Installation

```bash
npm i ibs-format --save
```

<a name="usage"/>

# Usage

<a name="text-formatting"/>

## Text Formatting

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
var tagArray = [['b','*'],['i','_'],['strike','~'],["mark","!"]];
```

 * Here symbol, 'b' is using for 'bold', 'i' for 'italic', 'strike' for 'strike' and 'mark' for 'mark' tag with their respective Identifiers.
 * The user can use as many tags and their identifiers of his own choice.
 * Some special characters can't be used as identifiers for example, dollar sign '$'.
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

<a name="links-detecting"/>

# Links Detecting

For auto detecting links in to the text and converting them to HTML `<a>` tags, the function 'ibsFormat' needs three arguments
 * To enable auto detecting links create an object and set its 'detectLinks' property to true.
 * You can also specify the target of the links by creating a property 'target' in the object, it is optional with default value '_self'.
 * The value of 'target' property can be set to, '_blank', '_self', '_parent', '_top'.
 * Put the object in the third argument.
 Like:

 ```js
 var myText = "The *best* website for learning _JS_ is https://www.w3schools.com/ and my email is info@myemail.com."

 var tagArray = [['b','*'],['i','_'],['strike','~'],["mark","!"]];

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
myText = ibsFormat(myText, null, obj);
```
<a name="cross-site-scripting-(xss)"/>

# Cross Site Scripting (XSS).

XSS attacks enable attackers to inject client-side scripts into web pages viewed by other users. In order to prevent those scripts, the
client side tags are converted into nonexecutable through escaping. These security checks are enabled by default and it is recommended to
keep them enabled, but in order to bypass these security checks place a forth argument in the function. 

### In order to skip the XSS security checking:

Place a JSON object in the forth argument and set it's value to false, if the forth argument is missing then it's value will be true by default. 

```js
myText = ibsFormat(myText, tagArray, obj, { allowXssEscaping : false });
```

<a name="format-the-text-at-run-time-using-custom-pipe"/>

# Format the text at run time using custom Pipe.

In order to format the text at run time in HTML, create a custom pipe and use the function there.

### Create a custom pipe, 'custom-pipe.pipe.ts'.

```js
import { Pipe, PipeTransform } from '@angular/core';
import { ibsFormat } from "ibs-format";

@Pipe({ name: 'ibsformat' })
export class ibsformatPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    
    value = ibsFormat(value, [["b", "*"], ["i", "_"], ["strike", "~"],["mark","!"]],{ detectLinks: true, target: "_blank" });

    return value;
  }
}
```

### Make its entry in 'module.ts'.

```js
import { ibsformatPipe } from './custom-pipe.pipe';

// also add in declarations array
@NgModule({
  declarations: [ AppComponent, ibsformatPipe ],
})
```

### Now use the pipe directly in HTMl

`<p [innerHTML]="myText | ibsformat"></p>`

<a name="use-the-external-'ngx-linkifyjs'-library-for-detecting-the-links"/>

# Use the external 'ngx-linkifyjs' library for detecting the links

If you do not want to use the built-in 'detectLinks' functionality and want to use any other library for detecting the links, like 'ngx-linkifyjs', so after installing and configuring the 'ngx-linkifyjs' you can use the 'linkify' pipe before the 'ibsFormat' pipe, 
and set the library's 'detectLinks' and 'allowXssEscaping' properties to false.

`<p [innerHTML]="myText | linkify | ibsformat"></p>`

```js
value = ibsFormat(
      value,
      [["b", "*"], ["i", "_"], ["strike", "~"], ["mark", "!"]],
      { detectLinks: false, target: "_blank" }, 
      { allowXssEscaping: false } 
    )
```


For full example of custom pipe, see the live demo mention above.

### Feel free to report any bugs or improvements.

<a name="precautions"/>

# Precautions

* Don't change the index positioning.
* The function does not supports double or multiple identifiers rather than double asterisks '**'.
* Don't use same identifiers for multiple tags.
* Some special characters can't be used as identifiers for example, dollar sign '$'.

