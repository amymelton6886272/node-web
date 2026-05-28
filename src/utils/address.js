import { addressCountries, firstNames, lastNames, pick, rand } from '../data/addressData.js';

function makePhone(c){
 if(c.code==='CN'){
   const prefixes=['130','131','132','133','135','136','137','138','139','150','151','152','155','156','157','158','159','166','170','171','172','173','175','176','177','178','180','181','182','183','184','185','186','187','188','189','191','193','195','196','197','198','199'];
   return `+86 ${pick(prefixes)} ${rand(1000,9999)} ${rand(1000,9999)}`;
 }
 return `${c.phone} ${rand(100,999)} ${rand(100,999)} ${rand(1000,9999)}`;
}

export function makeAddress(countryCode){
 const c=addressCountries.find(x=>x.code===countryCode)||addressCountries[0];
 const gender=pick(['Male','Female']);
 const name=`${pick(firstNames)} ${pick(lastNames)}`;
 const city=pick(c.cities); const street=`${rand(10,9999)} ${pick(c.streets)}`; const postal=c.postal();
 const phone=makePhone(c);
 return {id:Date.now()+Math.random(), country:c.code, countryName:c.name, countryZh:c.zh, name, gender, phone, phoneClean:phone.replace(/\s/g,''), street, city, postal, address:`${street}, ${city}, ${postal}, ${c.code}`, time:new Date().toLocaleString()};
}
