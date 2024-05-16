module.exports = (text) => {
    const words = text.split(' ');
    const capitalisedWords = words.map((word) => {
      const firstLetter = word.slice(0, 1).toUpperCase();
      const otherChars = word.slice(1).toLowerCase();
      return firstLetter + otherChars;
    });
    return capitalisedWords.join(' ');
  }