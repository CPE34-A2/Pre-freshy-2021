export function concatClasses(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function numberWithCommas(number) {
  number = parseInt(number)
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function getClanName(clanId) {
  return [
    'แจ็คสแปโร่โอ้โห้โอโห้เฮะ',
    'โจรสลัดสะบัดอวกาศ',
    'ยูเรนัสมัดใจเธอ',
    'สตาร์เท็คอย่าลืมเช็คสเตตัส',
    'นิวอามสตรองครองหัวใจ',
    'ดาวอังคารไม่ขึ้นคานนะครับ',
    'Space X เข้ามาระวังเคล็ดนะค้าบ'
  ][clanId - 1]
}