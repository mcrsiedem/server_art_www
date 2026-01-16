function getShortYear() {
  const date = new Date();
  // Pobierz pełny rok (np. 2026), zamień na tekst i weź 2 ostatnie znaki
  // return date.getFullYear().toString().slice(-2);
  return date.getFullYear().toString()
}


module.exports = {
    getShortYear
    
}
 