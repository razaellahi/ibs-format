# What is this ?

Format the text into bold, italic and strike by applying HTML tags.

# Demo

<a href="https://stackblitz.com/edit/angular-ivy-gdpuva?file=src%2Fapp%2Fapp.component.html">CLICK HERE</a>

# Installation

`npm i ibs-format --save`

Then...

```
import { ibsFormat } from 'ibs-format';

var myText = ibsFormat("Apply *bold*, _italic_, and ~strike~ on the text");

<p [innerHTML]="myText"></p>

```

## Options

Use symbols before and after the character or word for applying HTML tags in the text.

* asterisk symbol '*' for bold.
* tilde symbol '~' for strike.
* underscore symbol '_' for italic.

LIKE:
```
Once upon a time, there was a *thristy* ~_crow_~.

```
AND THE OUTPUT WILL BE:
```
Once upon a time, there was a <b>thristy</b> <strike><i>crow</i></strike>.

```
RESULT:

Once upon a time, there was a <b>thristy</b> <strike><i>crow</i></strike>.
