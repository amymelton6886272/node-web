export function rand(min,max){return Math.floor(Math.random()*(max-min+1))+min}
export function pick(arr){return arr[Math.floor(Math.random()*arr.length)]}

export const addressCountries = [
  {code:'US', name:'United States', zh:'美国', phone:'+1', postal:()=>String(rand(10000,99999)), cities:['New York','Los Angeles','Chicago','Houston','Seattle','Austin','Boston','San Francisco'], streets:['Main St','Oak Ave','Maple Dr','Cedar Ln','Washington Blvd','Lake View Rd']},
  {code:'CA', name:'Canada', zh:'加拿大', phone:'+1', postal:()=>`${pick('ABCEGHJKLMNPRSTVXY')}${rand(1,9)}${pick('ABCDEFGHIJKLMNOPQRSTUVWXYZ')} ${rand(1,9)}${pick('ABCDEFGHIJKLMNOPQRSTUVWXYZ')}${rand(1,9)}`, cities:['Toronto','Vancouver','Montreal','Calgary','Ottawa','Edmonton'], streets:['King St','Queen St','Maple Rd','Yonge St','Granville St','Victoria Ave']},
  {code:'UK', name:'United Kingdom', zh:'英国', phone:'+44', postal:()=>`${pick(['SW','NW','EC','W','M','B'])}${rand(1,20)} ${rand(1,9)}${pick('ABCDEFGHIJKLMNOPQRSTUVWXYZ')}${pick('ABCDEFGHIJKLMNOPQRSTUVWXYZ')}`, cities:['London','Manchester','Birmingham','Leeds','Glasgow','Bristol'], streets:['High Street','Station Road','Church Lane','Victoria Road','Green Lane','Park Road']},
  {code:'DE', name:'Germany', zh:'德国', phone:'+49', postal:()=>String(rand(10000,99999)), cities:['Berlin','Munich','Hamburg','Frankfurt','Cologne','Stuttgart'], streets:['Hauptstraße','Bahnhofstraße','Gartenweg','Schulstraße','Mühlenweg','Bergstraße']},
  {code:'FR', name:'France', zh:'法国', phone:'+33', postal:()=>String(rand(10000,95999)), cities:['Paris','Lyon','Marseille','Toulouse','Nice','Nantes'], streets:['Rue de la Paix','Avenue Victor Hugo','Rue Nationale','Rue des Fleurs','Boulevard Saint-Michel']},
  {code:'JP', name:'Japan', zh:'日本', phone:'+81', postal:()=>`${rand(100,999)}-${rand(1000,9999)}`, cities:['Tokyo','Osaka','Kyoto','Yokohama','Nagoya','Fukuoka'], streets:['Chiyoda','Shibuya','Namba','Sakae','Hakata','Gion']},
  {code:'KR', name:'South Korea', zh:'韩国', phone:'+82', postal:()=>String(rand(10000,63999)), cities:['Seoul','Busan','Incheon','Daegu','Daejeon','Gwangju'], streets:['Teheran-ro','Gangnam-daero','Jong-ro','Haeundae-ro','Mapo-daero']},
  {code:'CN', name:'China', zh:'中国', phone:'+86', postal:()=>String(rand(100000,999999)), cities:['Beijing','Shanghai','Guangzhou','Shenzhen','Hangzhou','Chengdu'], streets:['Zhongshan Road','Renmin Road','Jiefang Road','Nanjing Road','Wenhua Street']},
  {code:'SG', name:'Singapore', zh:'新加坡', phone:'+65', postal:()=>String(rand(100000,829999)), cities:['Singapore'], streets:['Orchard Road','Cecil Street','North Bridge Road','Tanjong Pagar Road','River Valley Road']},
  {code:'AU', name:'Australia', zh:'澳大利亚', phone:'+61', postal:()=>String(rand(2000,7999)), cities:['Sydney','Melbourne','Brisbane','Perth','Adelaide','Canberra'], streets:['George Street','King Street','Collins Street','Elizabeth Street','Queen Street','Station Road']},
];

export const firstNames=['Liam','Noah','Oliver','James','Lucas','Mason','Ethan','Mia','Emma','Olivia','Ava','Sophia','Luna','Chloe','Grace','Yuki','Hana','Mina','Wei','Lin'];
export const lastNames=['Smith','Johnson','Brown','Taylor','Miller','Wilson','Martin','Lee','Kim','Wang','Chen','Tanaka','Sato','Garcia','Dubois','Müller'];
