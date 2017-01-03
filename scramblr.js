
n(global, $){//iife

  'use strict';//es6 strict mode declaration
  var Scramblr = function(text, stringType){//instantiation closure
    return new Scramblr.init(text, stringType);//instantiation
  }

  var stringTypes = ['singleWord','multi-word','alphaNumerical'];

  var jqueryFallback = function(selector,output){// jQuery fallback helper.
    if(typeof selector === 'string'){
      if(!$){
        // throw "jQuery is not defined, sorry dudes!";
        console.warn("jQuery is not defined, sorry dudes!");
      } else {
        $(selector).html(output);
      }
    } else if(console){
      console.log(output);
    } else {
      alert(output);
    }
  }

  var unscrambledHashTable = [];
  var characters = "abcdefghijklmnopqstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0987654321!@#$%^&*()-_+=|{[]}?.><,/ ";
  for (var i = 0; i < characters.length; i++){
    unscrambledHashTable.push(characters[i].charCodeAt());
  }
  var hashScrambling = function(characters){

  }
  var arrayify = function(text){
    var chars = [], windex = 0;
    for (var character in text) {

      chars.push({character: text[windex],unicode: text.charCodeAt(windex)});
      windex++;
    }
    return chars;
  }

  var bubbleSort = function(chars){
    for (var i = 1; i < chars.length; i++) {
      for (var j = 0; j < chars.length; j++) {
        var changed = {};
        if (chars[i].unicode > chars[j].unicode){
          changed = chars[j];
          chars[j] = chars[i];
          chars[i] = changed;
        }
      }
    }

    return chars;
  }

  // This is a natural merge sort algorithm.

  var mergeSort = function(chars) {

    if (chars.length == 1){
      return chars;
    }

    var halfWay = Math.floor(chars.length/2);

    var firstHalf = chars.slice(0,halfWay);
    var secondHalf = chars.slice(halfWay);

      console.log("FirstHalf: ", firstHalf);
      console.log("SecondHalf:", secondHalf);

    firstHalf = mergeSort(firstHalf);
    secondHalf = mergeSort(secondHalf);

    return merge(firstHalf, secondHalf);

  }

  var merge = function(firstHalf, secondHalf){
    var sortedChars = [];
    while (firstHalf.length > 0 && secondHalf.length > 0){
      if (firstHalf[0].unicode > secondHalf[0].unicode){
        sortedChars.push(secondHalf.shift());
      } else {
        sortedChars.push(firstHalf.shift());
      }
    }
    while (firstHalf.length > 0){
      sortedChars.push(firstHalf.shift());
    }

    while (secondHalf.length > 0){
      sortedChars.push(secondHalf.shift());
    }
    return sortedChars;
  }

  var sortByUnicode = function(chars,type){
    var characters = Object.prototype.toString.call( chars ) === '[object Array]' ? chars : [];

    var unicodeSorted = [];

    if (!characters.length > 0) {
      return characters;
    } else {

      var unsortedChars = chars.slice(); // Creates a duplicate of the original array.

      if (type === 'unicode bubble sorted'){// Descending
        unicodeSorted = bubbleSort(unsortedChars);
      } else if (type === 'unicode merge sorted') {
        unicodeSorted = mergeSort(unsortedChars);
      }
    }
    return unicodeSorted;
  }

  var scramble = function(text){// Basic Scramble helper
    var lettersNum = text.length, newString = '', randomChars = [];

    for (lettersNum; lettersNum > 0; lettersNum--) {

      var random = Math.floor(Math.random() * lettersNum);

      if (text[random] === ' '){
        randomChars.push({character: '&nbsp;',unicode: text.charCodeAt(random)});
      } else {
        randomChars.push({character: text[random],unicode: text.charCodeAt(random)});
      }

      newString += text[random];//add selected character to a new string

      text = text.slice(0,random) + text.slice(random+1);//remove selected char from original string
    }

    return newString;
  }

  Scramblr.prototype = {//Packing the object full of goodies

    basicScramble: function(selector){

      this.characters = arrayify(this.text);

      this.randomCharString = scramble(this.text);

      if(typeof(selector) === 'string'){
        jqueryFallback(selector,this.randomCharString);
      }
      //Returning _this_ allows the method to be chainable,
      //since the calling object will be returned
      return this;
    },
    unicodeSorted: function(type,selector){

      this.sortedChars = sortByUnicode(arrayify(this.text), type);

      this.sortedString = (function(chars){

        var charString = '';

        for(var i = 0; i < chars.length; i++) {
          if (chars[i].character === ' '){
            chars[i].character = '&nbsp;';
          }

          charString += chars[i].character;
        }

        return charString;
      })(this.sortedChars);

      if(typeof(selector) === 'string'){
        jqueryFallback(selector,this.sortedString);
      }

      return this;
    },
    inlineScramble: function(selector){//scramble individual words
      //Splitting a string into substrings based upon the nbsp character.
       var scrambledString, words = this.text.split(' ');
       for (var i = 0; i < words.length; i++){
         words[i] = scramble(words[i]);
       }
       scrambledString = words.join(' ');
       jqueryFallback(selector, scrambledString);
       return this;
    },
    unscramble: function(selector,alg){//function for unscrambling words, try doing algorithms here.
      //To unscramble a string, you need some way to know what the original string is
      //Obviously, if you are already storing the original, then there is no reason to unscramble,
      //except as a method for testing the speed of different algorithms that are almost guaranteed to make mistakes and have to compensate.
      //This is certainly a good machine learning challenge, as efficiency would demand that the system learn in some way to anticipate patterns.

      //If you want to use a more secure approach to unscrambling, then you would need to scramble in an established way.
      //Options include:
      //pattern scramble - where a set of established routines are run through to scramble and then reversed to unscramble,
      //saved-hash-based scramble - where each character has an in-place alternative that is saved to the database in the form of a hash.
      //hash-key scramble - where characters are reassigned based on a hash, but that hash is provided to the end user and not saved. End user would pass the hash back to the system to unscramble
      //double hash scramble - where the two hash approaches are used in concert with one another. The user hash would essentially provide a translation key for the saved hash, which would represent the original string in hashed form. 

      return this;
    },
    unicodify: function(selector,scrambled){
      var unicodifiedArray = [], unicodifiedString = '';
      if(!scrambled){
        for (var i = 0; i < this.text.length; i++){
          var unicodifiedChar = this.text[i].charCodeAt();
          unicodifiedArray.push(unicodifiedChar)
          unicodifiedString += unicodifiedChar;
        }
        return unicodifiedString;
      } else {
        return this.text;
      }
    }
  };

  Scramblr.init = function(text, stringType) {
    var that = this;
    that.text = text || '';
  };

  Scramblr.init.prototype = Scramblr.prototype;

  global.Scramblr = global.S$ = Scramblr;

})(this);

