export function concatClasses(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function numberWithCommas(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}