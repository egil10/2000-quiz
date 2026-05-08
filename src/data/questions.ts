import type { QuizQuestion } from "@/types/game";

// Curated dataset of historical events from year 0 to 2000.
// Mixed Norwegian, Nordic and world history, science, culture and politics.
// Year refers to AD (e.t.). Designed to grow toward 10k entries; categorized
// and difficulty-tagged so we can filter, weight and scale.

const raw: Omit<QuizQuestion, "id">[] = [
  // === Antikken (0–500) ===
  { year: 9, event: "Slaget i Teutoburgerskogen — germanerne knuser tre romerske legioner", category: "krig", difficulty: "vanskelig" },
  { year: 14, event: "Keiser Augustus dør i Roma", category: "politikk", difficulty: "middels" },
  { year: 30, event: "Jesus blir korsfestet (tradisjonell datering)", category: "religion", difficulty: "lett" },
  { year: 43, event: "Romerne invaderer Britannia under keiser Claudius", category: "krig", difficulty: "middels" },
  { year: 64, event: "Den store brannen i Roma under Nero", category: "verden", difficulty: "middels" },
  { year: 70, event: "Romerne ødelegger tempelet i Jerusalem", category: "religion", difficulty: "middels" },
  { year: 79, event: "Vesuv får utbrudd og begraver Pompeii", category: "verden", difficulty: "lett" },
  { year: 80, event: "Colosseum i Roma åpnes", category: "kultur", difficulty: "middels" },
  { year: 122, event: "Bygging av Hadrians mur i Britannia starter", category: "verden", difficulty: "middels" },
  { year: 180, event: "Marcus Aurelius dør og slutten på Pax Romana", category: "politikk", difficulty: "vanskelig" },
  { year: 313, event: "Milanoediktet legaliserer kristendom i Romerriket", category: "religion", difficulty: "vanskelig" },
  { year: 325, event: "Konsilet i Nikea fastlegger den nikenske trosbekjennelse", category: "religion", difficulty: "vanskelig" },
  { year: 330, event: "Konstantinopel blir grunnlagt som ny romersk hovedstad", category: "politikk", difficulty: "vanskelig" },
  { year: 380, event: "Kristendommen blir statsreligion i Romerriket", category: "religion", difficulty: "vanskelig" },
  { year: 410, event: "Visigotene plyndrer Roma", category: "krig", difficulty: "vanskelig" },
  { year: 432, event: "Sankt Patrick begynner sin misjon på Irland", category: "religion", difficulty: "vanskelig" },
  { year: 455, event: "Vandalene plyndrer Roma", category: "krig", difficulty: "vanskelig" },
  { year: 476, event: "Det vestromerske riket faller", category: "verden", difficulty: "middels" },
  { year: 481, event: "Klodvig blir konge over frankerne", category: "politikk", difficulty: "vanskelig" },

  // === Tidlig middelalder (500–1000) ===
  { year: 537, event: "Hagia Sophia i Konstantinopel ferdigstilles", category: "kunst", difficulty: "vanskelig" },
  { year: 570, event: "Profeten Muhammed blir født", category: "religion", difficulty: "middels" },
  { year: 622, event: "Hijra — Muhammeds reise fra Mekka til Medina", category: "religion", difficulty: "vanskelig" },
  { year: 632, event: "Muhammed dør og det islamske riket begynner sin ekspansjon", category: "religion", difficulty: "middels" },
  { year: 711, event: "Maurerne invaderer Den iberiske halvøy", category: "krig", difficulty: "vanskelig" },
  { year: 732, event: "Slaget ved Tours stopper muslimsk fremrykning i Vest-Europa", category: "krig", difficulty: "vanskelig" },
  { year: 793, event: "Vikingene plyndrer Lindisfarne — vikingtidens start", category: "norge", difficulty: "middels" },
  { year: 800, event: "Karl den store krones til keiser", category: "politikk", difficulty: "middels" },
  { year: 845, event: "Vikinger plyndrer Paris for første gang", category: "krig", difficulty: "vanskelig" },
  { year: 872, event: "Slaget i Hafrsfjord — Harald Hårfagre samler Norge", category: "norge", difficulty: "lett" },
  { year: 874, event: "Norske vikinger koloniserer Island", category: "norge", difficulty: "middels" },
  { year: 911, event: "Vikinghøvdingen Rollo grunnlegger Normandie", category: "verden", difficulty: "vanskelig" },
  { year: 930, event: "Alltinget på Island grunnlegges — verdens eldste parlament", category: "politikk", difficulty: "vanskelig" },
  { year: 982, event: "Erik Raude oppdager Grønland", category: "norge", difficulty: "middels" },
  { year: 988, event: "Kievriket blir kristnet", category: "religion", difficulty: "vanskelig" },
  { year: 995, event: "Olav Tryggvason blir konge i Norge", category: "norge", difficulty: "middels" },
  { year: 1000, event: "Slaget ved Svolder — Olav Tryggvason faller", category: "norge", difficulty: "vanskelig" },
  { year: 1000, event: "Leiv Eiriksson når Vinland (Nord-Amerika)", category: "norge", difficulty: "middels" },
  { year: 1000, event: "Island vedtar kristendommen som offisiell religion", category: "religion", difficulty: "vanskelig" },

  // === Høymiddelalder (1000–1300) ===
  { year: 1030, event: "Slaget på Stiklestad — Olav den hellige faller", category: "norge", difficulty: "lett" },
  { year: 1066, event: "Slaget ved Stamford Bridge — Harald Hardråde dør", category: "norge", difficulty: "middels" },
  { year: 1066, event: "Slaget ved Hastings — William erobrer England", category: "krig", difficulty: "lett" },
  { year: 1095, event: "Pave Urban II innleder det første korstoget", category: "religion", difficulty: "middels" },
  { year: 1099, event: "Korsfarerne erobrer Jerusalem", category: "krig", difficulty: "middels" },
  { year: 1130, event: "Borgerkrigstiden i Norge begynner", category: "norge", difficulty: "vanskelig" },
  { year: 1152, event: "Nidaros blir eget erkebispedømme", category: "religion", difficulty: "vanskelig" },
  { year: 1184, event: "Sverre Sigurdsson vinner slaget på Fimreite", category: "norge", difficulty: "vanskelig" },
  { year: 1187, event: "Saladin gjenerobrer Jerusalem fra korsfarerne", category: "krig", difficulty: "middels" },
  { year: 1206, event: "Birkebeinerne flykter med kongssønnen Håkon Håkonsson over fjellet", category: "norge", difficulty: "middels" },
  { year: 1215, event: "Magna Carta blir undertegnet i England", category: "politikk", difficulty: "lett" },
  { year: 1217, event: "Håkon Håkonsson blir konge i Norge", category: "norge", difficulty: "middels" },
  { year: 1223, event: "Mongolene under Djengis Khan ekspanderer mot vest", category: "krig", difficulty: "vanskelig" },
  { year: 1240, event: "Slaget ved Neva — Aleksander Nevskij slår svenskene", category: "krig", difficulty: "vanskelig" },
  { year: 1262, event: "Island går inn i union med Norge", category: "norge", difficulty: "vanskelig" },
  { year: 1266, event: "Norge selger Hebridene og Man til Skottland", category: "norge", difficulty: "vanskelig" },
  { year: 1271, event: "Marco Polo legger ut på reisen til Kina", category: "verden", difficulty: "middels" },
  { year: 1274, event: "Magnus Lagabøte gir Norge en samlet landslov", category: "norge", difficulty: "vanskelig" },
  { year: 1291, event: "Edsforbundet i Sveits blir inngått", category: "politikk", difficulty: "vanskelig" },

  // === Senmiddelalder (1300–1500) ===
  { year: 1302, event: "Slaget ved de gylne sporer — flamske byer slår fransk hær", category: "krig", difficulty: "vanskelig" },
  { year: 1314, event: "Slaget ved Bannockburn — Skottland slår England", category: "krig", difficulty: "vanskelig" },
  { year: 1319, event: "Norge og Sverige går i personalunion", category: "norge", difficulty: "vanskelig" },
  { year: 1337, event: "Hundreårskrigen mellom England og Frankrike begynner", category: "krig", difficulty: "middels" },
  { year: 1347, event: "Svartedauden når Sicilia og brer seg i Europa", category: "verden", difficulty: "middels" },
  { year: 1349, event: "Svartedauden kommer til Norge", category: "norge", difficulty: "middels" },
  { year: 1397, event: "Kalmarunionen — Norge, Sverige og Danmark forenes", category: "norge", difficulty: "lett" },
  { year: 1415, event: "Slaget ved Agincourt — engelske bueskyttere knuser fransk hær", category: "krig", difficulty: "middels" },
  { year: 1431, event: "Jeanne d'Arc blir brent på bålet", category: "verden", difficulty: "middels" },
  { year: 1440, event: "Gutenberg utvikler trykkpressen i Europa", category: "oppfinnelse", difficulty: "middels" },
  { year: 1453, event: "Konstantinopel faller for osmanerne", category: "krig", difficulty: "middels" },
  { year: 1453, event: "Hundreårskrigen avsluttes", category: "krig", difficulty: "middels" },
  { year: 1469, event: "Orknøyene og Shetland pantsettes til Skottland", category: "norge", difficulty: "vanskelig" },
  { year: 1492, event: "Columbus når Amerika", category: "verden", difficulty: "lett" },
  { year: 1492, event: "Granada faller — slutten på Reconquista", category: "krig", difficulty: "vanskelig" },
  { year: 1498, event: "Vasco da Gama når India sjøveien", category: "verden", difficulty: "middels" },

  // === 1500-tallet ===
  { year: 1503, event: "Leonardo da Vinci begynner å male Mona Lisa", category: "kunst", difficulty: "middels" },
  { year: 1509, event: "Henrik VIII blir konge i England", category: "politikk", difficulty: "middels" },
  { year: 1517, event: "Martin Luther slår opp sine 95 teser", category: "religion", difficulty: "lett" },
  { year: 1519, event: "Magellan starter sin jordomseiling", category: "verden", difficulty: "middels" },
  { year: 1521, event: "Aztekerriket faller for Hernán Cortés", category: "krig", difficulty: "middels" },
  { year: 1524, event: "Kalmarunionen oppløses", category: "norge", difficulty: "middels" },
  { year: 1533, event: "Inkariket faller for Pizarro", category: "krig", difficulty: "vanskelig" },
  { year: 1536, event: "Reformasjonen i Norge — Norge blir lensland under Danmark", category: "norge", difficulty: "middels" },
  { year: 1543, event: "Kopernikus utgir verket om jordens bevegelse rundt sola", category: "vitenskap", difficulty: "middels" },
  { year: 1558, event: "Elisabeth I blir dronning av England", category: "politikk", difficulty: "middels" },
  { year: 1564, event: "William Shakespeare blir født", category: "kultur", difficulty: "middels" },
  { year: 1572, event: "Bartolomeusnatten — massakre på hugenotter i Paris", category: "religion", difficulty: "vanskelig" },
  { year: 1582, event: "Den gregorianske kalender innføres", category: "vitenskap", difficulty: "vanskelig" },
  { year: 1588, event: "Den spanske armada blir knust", category: "krig", difficulty: "middels" },
  { year: 1600, event: "Giordano Bruno brennes på bålet i Roma", category: "vitenskap", difficulty: "vanskelig" },

  // === 1600-tallet ===
  { year: 1603, event: "Tokugawa-shogunatet etableres i Japan", category: "politikk", difficulty: "vanskelig" },
  { year: 1605, event: "Don Quijote bok 1 utgis av Cervantes", category: "kultur", difficulty: "vanskelig" },
  { year: 1607, event: "Jamestown grunnlegges som første permanente engelske koloni", category: "verden", difficulty: "middels" },
  { year: 1609, event: "Galileo bruker teleskop til å studere himmelen", category: "vitenskap", difficulty: "middels" },
  { year: 1611, event: "King James-bibelen utgis", category: "religion", difficulty: "vanskelig" },
  { year: 1618, event: "Trettiårskrigen begynner", category: "krig", difficulty: "middels" },
  { year: 1620, event: "Mayflower seiler til Nord-Amerika", category: "verden", difficulty: "lett" },
  { year: 1624, event: "Christiania (Oslo) flyttes etter brann og får sitt nye navn", category: "norge", difficulty: "vanskelig" },
  { year: 1632, event: "Slaget ved Lützen — Gustav II Adolf av Sverige faller", category: "krig", difficulty: "vanskelig" },
  { year: 1642, event: "Den engelske borgerkrigen begynner", category: "krig", difficulty: "vanskelig" },
  { year: 1648, event: "Westfalske fred avslutter trettiårskrigen", category: "politikk", difficulty: "middels" },
  { year: 1649, event: "Karl I av England blir henrettet", category: "politikk", difficulty: "middels" },
  { year: 1660, event: "Eneveldet innføres i Danmark-Norge", category: "norge", difficulty: "vanskelig" },
  { year: 1665, event: "Den store pesten i London", category: "verden", difficulty: "middels" },
  { year: 1666, event: "Den store brannen i London", category: "verden", difficulty: "middels" },
  { year: 1682, event: "Ludvig XIV flytter hoffet til Versailles", category: "kultur", difficulty: "vanskelig" },
  { year: 1687, event: "Newton utgir Principia — gravitasjonsloven", category: "vitenskap", difficulty: "middels" },
  { year: 1688, event: "Den ærerike revolusjonen i England", category: "politikk", difficulty: "vanskelig" },
  { year: 1692, event: "Heksprosessene i Salem", category: "religion", difficulty: "middels" },

  // === 1700-tallet ===
  { year: 1700, event: "Den store nordiske krig begynner", category: "krig", difficulty: "vanskelig" },
  { year: 1718, event: "Karl XII av Sverige skutt ved Fredriksten festning", category: "norge", difficulty: "middels" },
  { year: 1721, event: "Hans Egede ankommer Grønland som misjonær", category: "norge", difficulty: "vanskelig" },
  { year: 1751, event: "Diderot utgir første bind av Encyclopédie", category: "kultur", difficulty: "vanskelig" },
  { year: 1755, event: "Jordskjelvet i Lisboa", category: "verden", difficulty: "vanskelig" },
  { year: 1756, event: "Sjuårskrigen begynner", category: "krig", difficulty: "vanskelig" },
  { year: 1769, event: "James Watt forbedrer dampmaskinen", category: "oppfinnelse", difficulty: "middels" },
  { year: 1770, event: "James Cook ankommer Australia", category: "verden", difficulty: "middels" },
  { year: 1773, event: "Boston Tea Party", category: "politikk", difficulty: "middels" },
  { year: 1776, event: "USAs uavhengighetserklæring", category: "politikk", difficulty: "lett" },
  { year: 1783, event: "Brødrene Montgolfier sender opp den første luftballongen", category: "oppfinnelse", difficulty: "vanskelig" },
  { year: 1787, event: "USAs grunnlov undertegnes", category: "politikk", difficulty: "middels" },
  { year: 1789, event: "Den franske revolusjon begynner med stormingen av Bastillen", category: "politikk", difficulty: "lett" },
  { year: 1789, event: "George Washington blir USAs første president", category: "politikk", difficulty: "middels" },
  { year: 1793, event: "Ludvig XVI av Frankrike henrettes med giljotin", category: "politikk", difficulty: "middels" },
  { year: 1796, event: "Edward Jenner utvikler første koppevaksine", category: "vitenskap", difficulty: "middels" },
  { year: 1799, event: "Napoleon tar makten i Frankrike ved et statskupp", category: "politikk", difficulty: "middels" },

  // === 1800-tallet ===
  { year: 1804, event: "Napoleon krones til keiser", category: "politikk", difficulty: "middels" },
  { year: 1804, event: "Lewis og Clark starter ekspedisjonen sin", category: "verden", difficulty: "vanskelig" },
  { year: 1805, event: "Slaget ved Trafalgar — Nelson slår fransk-spansk flåte", category: "krig", difficulty: "middels" },
  { year: 1807, event: "Storbritannia avskaffer slavehandelen", category: "politikk", difficulty: "middels" },
  { year: 1807, event: "Britene bombarderer København og tar den dansk-norske flåten", category: "norge", difficulty: "vanskelig" },
  { year: 1812, event: "Napoleons katastrofale felttog mot Russland", category: "krig", difficulty: "middels" },
  { year: 1814, event: "Norges grunnlov vedtas på Eidsvoll 17. mai", category: "norge", difficulty: "lett" },
  { year: 1814, event: "Norge går i union med Sverige etter Kielfreden", category: "norge", difficulty: "lett" },
  { year: 1815, event: "Slaget ved Waterloo — Napoleon beseires endelig", category: "krig", difficulty: "lett" },
  { year: 1819, event: "Universitetet i Christiania (Oslo) åpner", category: "norge", difficulty: "vanskelig" },
  { year: 1821, event: "Napoleon dør på Sankt Helena", category: "politikk", difficulty: "middels" },
  { year: 1825, event: "Verdens første offentlige jernbanestrekning åpner i England", category: "oppfinnelse", difficulty: "vanskelig" },
  { year: 1825, event: "Sluppen Restauration — første norske utvandrere til USA", category: "norge", difficulty: "vanskelig" },
  { year: 1829, event: "Torvslaget i Christiania", category: "norge", difficulty: "vanskelig" },
  { year: 1830, event: "Julirevolusjonen i Frankrike", category: "politikk", difficulty: "vanskelig" },
  { year: 1837, event: "Victoria blir dronning av Storbritannia", category: "politikk", difficulty: "middels" },
  { year: 1839, event: "Daguerre presenterer fotografering for offentligheten", category: "oppfinnelse", difficulty: "middels" },
  { year: 1845, event: "Henrik Wergeland dør", category: "kultur", difficulty: "vanskelig" },
  { year: 1848, event: "Karl Marx og Engels utgir Det kommunistiske manifest", category: "politikk", difficulty: "middels" },
  { year: 1848, event: "Revolusjoner brer seg i Europa — Folkenes vår", category: "politikk", difficulty: "middels" },
  { year: 1854, event: "Norges første jernbane åpner mellom Christiania og Eidsvoll", category: "norge", difficulty: "middels" },
  { year: 1858, event: "Den første transatlantiske telegrafkabelen legges", category: "oppfinnelse", difficulty: "vanskelig" },
  { year: 1859, event: "Darwin utgir Artenes opprinnelse", category: "vitenskap", difficulty: "middels" },
  { year: 1861, event: "Den amerikanske borgerkrigen begynner", category: "krig", difficulty: "lett" },
  { year: 1863, event: "Slaget ved Gettysburg", category: "krig", difficulty: "middels" },
  { year: 1865, event: "Lincoln blir myrdet og amerikanske borgerkrigen slutter", category: "krig", difficulty: "middels" },
  { year: 1866, event: "Alfred Nobel patenterer dynamitt", category: "oppfinnelse", difficulty: "middels" },
  { year: 1867, event: "USA kjøper Alaska fra Russland", category: "politikk", difficulty: "middels" },
  { year: 1869, event: "Suezkanalen åpner", category: "oppfinnelse", difficulty: "middels" },
  { year: 1869, event: "Mendelejev presenterer det periodiske system", category: "vitenskap", difficulty: "middels" },
  { year: 1871, event: "Det tyske keiserriket samles under Bismarck", category: "politikk", difficulty: "middels" },
  { year: 1876, event: "Bell patenterer telefonen", category: "oppfinnelse", difficulty: "middels" },
  { year: 1879, event: "Edison utvikler en praktisk lyspære", category: "oppfinnelse", difficulty: "middels" },
  { year: 1879, event: "Henrik Ibsens Et dukkehjem urpremiere", category: "kultur", difficulty: "middels" },
  { year: 1884, event: "Parlamentarismen innføres i Norge", category: "norge", difficulty: "middels" },
  { year: 1885, event: "Karl Benz lager den første bilen med forbrenningsmotor", category: "oppfinnelse", difficulty: "middels" },
  { year: 1888, event: "Fridtjof Nansen krysser Grønland på ski", category: "norge", difficulty: "middels" },
  { year: 1889, event: "Eiffeltårnet ferdigstilles til verdensutstillingen i Paris", category: "kunst", difficulty: "lett" },
  { year: 1893, event: "Edvard Munch maler Skrik", category: "kunst", difficulty: "middels" },
  { year: 1895, event: "Röntgen oppdager røntgenstråler", category: "vitenskap", difficulty: "middels" },
  { year: 1895, event: "Brødrene Lumière holder første offentlige filmvisning", category: "oppfinnelse", difficulty: "middels" },
  { year: 1896, event: "De første moderne olympiske leker holdes i Athen", category: "idrett", difficulty: "middels" },
  { year: 1898, event: "Marie og Pierre Curie oppdager radium og polonium", category: "vitenskap", difficulty: "middels" },
  { year: 1900, event: "Max Planck legger grunnlaget for kvantemekanikken", category: "vitenskap", difficulty: "vanskelig" },

  // === 1900–1920 ===
  { year: 1901, event: "Første Nobelpris deles ut", category: "kultur", difficulty: "middels" },
  { year: 1903, event: "Brødrene Wright gjennomfører første motoriserte flyvning", category: "oppfinnelse", difficulty: "lett" },
  { year: 1903, event: "Bjørnstjerne Bjørnson får Nobelprisen i litteratur", category: "norge", difficulty: "vanskelig" },
  { year: 1905, event: "Norge går ut av unionen med Sverige", category: "norge", difficulty: "lett" },
  { year: 1905, event: "Einstein publiserer den spesielle relativitetsteorien", category: "vitenskap", difficulty: "middels" },
  { year: 1906, event: "Roald Amundsen fullfører gjennomseilingen av Nordvestpassasjen", category: "norge", difficulty: "middels" },
  { year: 1906, event: "Jordskjelvet i San Francisco", category: "verden", difficulty: "middels" },
  { year: 1908, event: "Ford lanserer Model T", category: "oppfinnelse", difficulty: "middels" },
  { year: 1909, event: "Robert Peary hevder å ha nådd Nordpolen", category: "verden", difficulty: "vanskelig" },
  { year: 1911, event: "Roald Amundsen når Sydpolen først", category: "norge", difficulty: "lett" },
  { year: 1912, event: "Titanic synker etter sammenstøt med isfjell", category: "verden", difficulty: "lett" },
  { year: 1913, event: "Norske kvinner får alminnelig stemmerett", category: "norge", difficulty: "lett" },
  { year: 1914, event: "Første verdenskrig bryter ut", category: "krig", difficulty: "lett" },
  { year: 1915, event: "Lusitania torpederes av tysk u-båt", category: "krig", difficulty: "middels" },
  { year: 1915, event: "Einstein publiserer den generelle relativitetsteorien", category: "vitenskap", difficulty: "middels" },
  { year: 1916, event: "Slaget ved Somme — første dag krever 20 000 britiske liv", category: "krig", difficulty: "middels" },
  { year: 1917, event: "Den russiske revolusjon — bolsjevikene tar makten", category: "politikk", difficulty: "lett" },
  { year: 1917, event: "USA går inn i første verdenskrig", category: "krig", difficulty: "middels" },
  { year: 1918, event: "Første verdenskrig slutter med våpenstillstand 11. november", category: "krig", difficulty: "lett" },
  { year: 1918, event: "Spanskesyken-pandemien sprer seg verden over", category: "verden", difficulty: "middels" },
  { year: 1919, event: "Versaillestraktaten undertegnes", category: "politikk", difficulty: "middels" },
  { year: 1920, event: "Folkeforbundet stiftes", category: "politikk", difficulty: "middels" },
  { year: 1920, event: "Knut Hamsun får Nobelprisen i litteratur", category: "norge", difficulty: "middels" },
  { year: 1920, event: "Kvinner i USA får stemmerett gjennom 19. grunnlovstillegg", category: "politikk", difficulty: "middels" },

  // === 1921–1940 ===
  { year: 1922, event: "Mussolini marsjerer mot Roma", category: "politikk", difficulty: "middels" },
  { year: 1922, event: "Tutankhamons grav blir oppdaget", category: "kultur", difficulty: "middels" },
  { year: 1922, event: "Sovjetunionen blir formelt opprettet", category: "politikk", difficulty: "middels" },
  { year: 1924, event: "Lenin dør og Stalin stiger til makten", category: "politikk", difficulty: "middels" },
  { year: 1924, event: "Christiania bytter navn til Oslo", category: "norge", difficulty: "middels" },
  { year: 1925, event: "John Logie Baird demonstrerer fjernsyn", category: "oppfinnelse", difficulty: "vanskelig" },
  { year: 1927, event: "Lindbergh flyr alene over Atlanteren", category: "oppfinnelse", difficulty: "middels" },
  { year: 1928, event: "Alexander Fleming oppdager penicillin", category: "vitenskap", difficulty: "middels" },
  { year: 1929, event: "Børskrakket på Wall Street utløser den store depresjonen", category: "politikk", difficulty: "lett" },
  { year: 1930, event: "Sigrid Undset får Nobelprisen i litteratur", category: "norge", difficulty: "vanskelig" },
  { year: 1931, event: "Empire State Building åpner", category: "kunst", difficulty: "middels" },
  { year: 1933, event: "Hitler blir rikskansler i Tyskland", category: "politikk", difficulty: "lett" },
  { year: 1933, event: "Roosevelt lanserer New Deal", category: "politikk", difficulty: "middels" },
  { year: 1936, event: "Den spanske borgerkrig begynner", category: "krig", difficulty: "middels" },
  { year: 1936, event: "OL i Berlin — Jesse Owens vinner fire gull", category: "idrett", difficulty: "middels" },
  { year: 1937, event: "Hindenburg-zeppelineren brenner opp", category: "verden", difficulty: "vanskelig" },
  { year: 1938, event: "Krystallnatten — pogromer mot jøder i Tyskland", category: "krig", difficulty: "middels" },
  { year: 1939, event: "Andre verdenskrig bryter ut da Tyskland angriper Polen", category: "krig", difficulty: "lett" },
  { year: 1940, event: "Tyskland invaderer Norge og Danmark 9. april", category: "norge", difficulty: "lett" },
  { year: 1940, event: "Slaget om Storbritannia kjemper i luften", category: "krig", difficulty: "middels" },
  { year: 1940, event: "Frankrike kapitulerer for Tyskland", category: "krig", difficulty: "middels" },

  // === 1941–1960 ===
  { year: 1941, event: "Tyskland angriper Sovjetunionen — Operasjon Barbarossa", category: "krig", difficulty: "middels" },
  { year: 1941, event: "Pearl Harbor — USA går inn i andre verdenskrig", category: "krig", difficulty: "lett" },
  { year: 1942, event: "Slaget ved Midway endrer krigen i Stillehavet", category: "krig", difficulty: "middels" },
  { year: 1942, event: "Slaget om Stalingrad begynner", category: "krig", difficulty: "middels" },
  { year: 1943, event: "Tungtvannsaksjonen på Vemork", category: "norge", difficulty: "middels" },
  { year: 1944, event: "D-dagen — alliert landgang i Normandie", category: "krig", difficulty: "lett" },
  { year: 1945, event: "Andre verdenskrig slutter i Europa 8. mai", category: "krig", difficulty: "lett" },
  { year: 1945, event: "Atombomber slippes over Hiroshima og Nagasaki", category: "krig", difficulty: "lett" },
  { year: 1945, event: "FN blir grunnlagt", category: "politikk", difficulty: "middels" },
  { year: 1947, event: "India og Pakistan blir uavhengige", category: "politikk", difficulty: "middels" },
  { year: 1947, event: "Marshallhjelpen lanseres", category: "politikk", difficulty: "middels" },
  { year: 1947, event: "Jackie Robinson bryter fargebarrieren i amerikansk baseball", category: "idrett", difficulty: "vanskelig" },
  { year: 1948, event: "Staten Israel blir opprettet", category: "politikk", difficulty: "middels" },
  { year: 1948, event: "Mahatma Gandhi blir myrdet", category: "politikk", difficulty: "middels" },
  { year: 1949, event: "NATO blir stiftet — Norge er medlem fra start", category: "norge", difficulty: "middels" },
  { year: 1949, event: "Folkerepublikken Kina opprettes", category: "politikk", difficulty: "middels" },
  { year: 1950, event: "Koreakrigen bryter ut", category: "krig", difficulty: "middels" },
  { year: 1952, event: "OL holdes i Oslo", category: "idrett", difficulty: "middels" },
  { year: 1953, event: "Watson og Crick beskriver DNA-strukturen", category: "vitenskap", difficulty: "middels" },
  { year: 1953, event: "Stalin dør", category: "politikk", difficulty: "middels" },
  { year: 1953, event: "Edmund Hillary og Tenzing Norgay når toppen av Mount Everest", category: "verden", difficulty: "middels" },
  { year: 1955, event: "Warszawapakten blir etablert", category: "politikk", difficulty: "vanskelig" },
  { year: 1955, event: "Rosa Parks nekter å reise seg på bussen i Montgomery", category: "politikk", difficulty: "middels" },
  { year: 1957, event: "Sovjet sender Sputnik i bane — romkappløpet begynner", category: "vitenskap", difficulty: "middels" },
  { year: 1959, event: "Cuba-revolusjonen — Castro tar makten", category: "politikk", difficulty: "middels" },

  // === 1960–1980 ===
  { year: 1961, event: "Jurij Gagarin blir første menneske i rommet", category: "vitenskap", difficulty: "middels" },
  { year: 1961, event: "Berlinmuren reises", category: "politikk", difficulty: "middels" },
  { year: 1962, event: "Cubakrisen bringer verden til randen av atomkrig", category: "politikk", difficulty: "middels" },
  { year: 1963, event: "John F. Kennedy blir myrdet i Dallas", category: "politikk", difficulty: "lett" },
  { year: 1963, event: "Martin Luther King holder talen «I Have a Dream»", category: "politikk", difficulty: "middels" },
  { year: 1964, event: "Beatles slår gjennom i USA", category: "kultur", difficulty: "middels" },
  { year: 1964, event: "Civil Rights Act undertegnes i USA", category: "politikk", difficulty: "middels" },
  { year: 1965, event: "USA trapper opp Vietnamkrigen", category: "krig", difficulty: "middels" },
  { year: 1967, event: "Seksdagerskrigen i Midtøsten", category: "krig", difficulty: "middels" },
  { year: 1968, event: "Martin Luther King blir myrdet", category: "politikk", difficulty: "middels" },
  { year: 1968, event: "Sovjet invaderer Tsjekkoslovakia og knuser Praha-våren", category: "politikk", difficulty: "middels" },
  { year: 1968, event: "Studentopprør i Paris — Mai 68", category: "politikk", difficulty: "vanskelig" },
  { year: 1969, event: "Apollo 11 lander på månen", category: "vitenskap", difficulty: "lett" },
  { year: 1969, event: "Woodstock-festivalen holdes i USA", category: "kultur", difficulty: "middels" },
  { year: 1969, event: "Norge finner olje på Ekofisk-feltet", category: "norge", difficulty: "middels" },
  { year: 1970, event: "Beatles oppløses", category: "kultur", difficulty: "middels" },
  { year: 1971, event: "Greenpeace blir grunnlagt", category: "politikk", difficulty: "middels" },
  { year: 1972, event: "Norge sier nei til EF-medlemskap i folkeavstemning", category: "norge", difficulty: "middels" },
  { year: 1972, event: "Watergate-innbruddet i Washington", category: "politikk", difficulty: "middels" },
  { year: 1973, event: "Oljekrisen rammer Vesten", category: "politikk", difficulty: "middels" },
  { year: 1973, event: "Pinochet tar makten i Chile ved kupp", category: "politikk", difficulty: "middels" },
  { year: 1974, event: "Nixon trekker seg etter Watergate", category: "politikk", difficulty: "middels" },
  { year: 1975, event: "Vietnamkrigen slutter med Saigons fall", category: "krig", difficulty: "middels" },
  { year: 1975, event: "Mikrosoft (senere Microsoft) blir grunnlagt", category: "oppfinnelse", difficulty: "middels" },
  { year: 1976, event: "Steve Jobs og Wozniak grunnlegger Apple", category: "oppfinnelse", difficulty: "middels" },
  { year: 1977, event: "Star Wars har premiere", category: "kultur", difficulty: "middels" },
  { year: 1977, event: "Bravoutblåsningen i Nordsjøen", category: "norge", difficulty: "vanskelig" },
  { year: 1978, event: "Verdens første prøverørsbarn fødes", category: "vitenskap", difficulty: "middels" },
  { year: 1979, event: "Den iranske revolusjon", category: "politikk", difficulty: "middels" },
  { year: 1979, event: "Sovjet invaderer Afghanistan", category: "krig", difficulty: "middels" },
  { year: 1979, event: "Margaret Thatcher blir Storbritannias statsminister", category: "politikk", difficulty: "middels" },

  // === 1980–2000 ===
  { year: 1980, event: "John Lennon blir myrdet i New York", category: "kultur", difficulty: "middels" },
  { year: 1980, event: "Alexander Kielland-plattformen velter i Nordsjøen", category: "norge", difficulty: "middels" },
  { year: 1981, event: "Gro Harlem Brundtland blir Norges første kvinnelige statsminister", category: "norge", difficulty: "middels" },
  { year: 1981, event: "MTV starter sendingene", category: "kultur", difficulty: "middels" },
  { year: 1981, event: "Romfergen Columbia tar av første gang", category: "vitenskap", difficulty: "vanskelig" },
  { year: 1982, event: "Falklandskrigen mellom Storbritannia og Argentina", category: "krig", difficulty: "middels" },
  { year: 1983, event: "Internett (TCP/IP) blir standard for ARPANET", category: "oppfinnelse", difficulty: "vanskelig" },
  { year: 1984, event: "Apple lanserer Macintosh", category: "oppfinnelse", difficulty: "middels" },
  { year: 1985, event: "Live Aid-konsertene mot sult i Etiopia", category: "kultur", difficulty: "middels" },
  { year: 1985, event: "Mikhail Gorbatsjov tar makten i Sovjet og lanserer perestrojka", category: "politikk", difficulty: "middels" },
  { year: 1986, event: "Tsjernobyl-ulykken", category: "verden", difficulty: "middels" },
  { year: 1986, event: "Romfergen Challenger eksploderer", category: "vitenskap", difficulty: "middels" },
  { year: 1986, event: "Olof Palme myrdet i Stockholm", category: "politikk", difficulty: "middels" },
  { year: 1987, event: "Brundtland-rapporten lanserer begrepet bærekraftig utvikling", category: "norge", difficulty: "vanskelig" },
  { year: 1989, event: "Berlinmuren faller", category: "politikk", difficulty: "lett" },
  { year: 1989, event: "Tiananmen-massakren i Beijing", category: "politikk", difficulty: "middels" },
  { year: 1989, event: "World Wide Web foreslås av Tim Berners-Lee", category: "oppfinnelse", difficulty: "middels" },
  { year: 1990, event: "Tyskland gjenforenes", category: "politikk", difficulty: "middels" },
  { year: 1990, event: "Hubble-romteleskopet skytes opp", category: "vitenskap", difficulty: "middels" },
  { year: 1990, event: "Nelson Mandela løslates etter 27 år i fengsel", category: "politikk", difficulty: "middels" },
  { year: 1991, event: "Sovjetunionen oppløses", category: "politikk", difficulty: "lett" },
  { year: 1991, event: "Den første Gulf-krigen", category: "krig", difficulty: "middels" },
  { year: 1991, event: "Web-servere blir tilgjengelige offentlig — World Wide Web går live", category: "oppfinnelse", difficulty: "vanskelig" },
  { year: 1992, event: "Maastrichttraktaten skaper EU", category: "politikk", difficulty: "middels" },
  { year: 1992, event: "Borgerkrigen i Bosnia bryter ut", category: "krig", difficulty: "middels" },
  { year: 1993, event: "EU blir formelt opprettet", category: "politikk", difficulty: "middels" },
  { year: 1994, event: "OL på Lillehammer", category: "norge", difficulty: "lett" },
  { year: 1994, event: "Norge sier nei til EU-medlemskap i folkeavstemning igjen", category: "norge", difficulty: "middels" },
  { year: 1994, event: "Folkemordet i Rwanda", category: "krig", difficulty: "middels" },
  { year: 1994, event: "Nelson Mandela velges til president i Sør-Afrika", category: "politikk", difficulty: "middels" },
  { year: 1995, event: "Skrik-tyveriet på Nasjonalgalleriet (under OL året før)", category: "norge", difficulty: "vanskelig" },
  { year: 1995, event: "Massakren i Srebrenica", category: "krig", difficulty: "middels" },
  { year: 1995, event: "Yitzhak Rabin myrdet", category: "politikk", difficulty: "middels" },
  { year: 1996, event: "Sauen Dolly blir klonet", category: "vitenskap", difficulty: "middels" },
  { year: 1997, event: "Prinsesse Diana dør i bilulykke i Paris", category: "kultur", difficulty: "lett" },
  { year: 1997, event: "Hongkong overføres fra Storbritannia til Kina", category: "politikk", difficulty: "middels" },
  { year: 1997, event: "Deep Blue slår Kasparov i sjakk", category: "vitenskap", difficulty: "middels" },
  { year: 1998, event: "Google blir grunnlagt", category: "oppfinnelse", difficulty: "middels" },
  { year: 1998, event: "Den internasjonale romstasjonen ISS — første modul i bane", category: "vitenskap", difficulty: "vanskelig" },
  { year: 1999, event: "Euroen innføres som regnskapsvaluta", category: "politikk", difficulty: "middels" },
  { year: 1999, event: "NATO bomber Serbia under Kosovokrigen", category: "krig", difficulty: "middels" },
  { year: 2000, event: "Y2K — millenniumsskiftet skaper uro for IT-systemer", category: "kultur", difficulty: "lett" },
  { year: 2000, event: "Putin velges til president i Russland for første gang", category: "politikk", difficulty: "middels" },

  // === Ekstra: kunst, kultur, idrett, vitenskap (spredt) ===
  { year: 1503, event: "Leonardo da Vincis Mona Lisa påbegynnes", category: "kunst", difficulty: "vanskelig" },
  { year: 1508, event: "Michelangelo begynner å male Det sixtinske kapell", category: "kunst", difficulty: "middels" },
  { year: 1665, event: "Vermeer maler Pike med perleøredobb", category: "kunst", difficulty: "vanskelig" },
  { year: 1808, event: "Goyas «Den 3. mai 1808» dokumenterer Napoleonskrigene", category: "kunst", difficulty: "vanskelig" },
  { year: 1875, event: "Bizets Carmen har urpremiere i Paris", category: "kultur", difficulty: "vanskelig" },
  { year: 1876, event: "Wagners Ringen om Nibelungen får sin første komplette oppførelse", category: "kultur", difficulty: "vanskelig" },
  { year: 1888, event: "Vincent van Gogh maler Solsikker", category: "kunst", difficulty: "middels" },
  { year: 1907, event: "Picasso maler Les Demoiselles d'Avignon", category: "kunst", difficulty: "vanskelig" },
  { year: 1937, event: "Picasso maler Guernica", category: "kunst", difficulty: "middels" },
  { year: 1957, event: "Sputnik 2 sender hunden Laika i bane", category: "vitenskap", difficulty: "middels" },
  { year: 1976, event: "Concorde begynner kommersiell rute", category: "oppfinnelse", difficulty: "vanskelig" },
  { year: 1985, event: "Wreck of Titanic blir lokalisert", category: "vitenskap", difficulty: "vanskelig" },
  { year: 1996, event: "Mars Pathfinder skytes opp", category: "vitenskap", difficulty: "vanskelig" },
  { year: 1997, event: "Harry Potter og de vises stein utgis", category: "kultur", difficulty: "middels" },

  // === Idrett ===
  { year: 1954, event: "Roger Bannister løper engelsk mil under fire minutter", category: "idrett", difficulty: "middels" },
  { year: 1958, event: "Brasil vinner sitt første VM i fotball", category: "idrett", difficulty: "middels" },
  { year: 1960, event: "Cassius Clay (senere Muhammad Ali) tar OL-gull i Roma", category: "idrett", difficulty: "vanskelig" },
  { year: 1966, event: "England vinner VM i fotball på hjemmebane", category: "idrett", difficulty: "middels" },
  { year: 1972, event: "Massakren under OL i München", category: "idrett", difficulty: "middels" },
  { year: 1980, event: "USAs «Miracle on Ice» mot Sovjet i ishockey", category: "idrett", difficulty: "vanskelig" },
  { year: 1988, event: "Ben Johnson dopingdiskvalifisert under OL i Seoul", category: "idrett", difficulty: "vanskelig" },
  { year: 1992, event: "USAs Dream Team dominerer OL-basketballen", category: "idrett", difficulty: "vanskelig" },
  { year: 1994, event: "VM i fotball arrangeres i USA", category: "idrett", difficulty: "vanskelig" },
  { year: 1998, event: "Frankrike vinner sitt første VM i fotball", category: "idrett", difficulty: "middels" },

  // === Norge spesifikt ===
  { year: 1697, event: "Karl XII krones som konge i Sverige", category: "norge", difficulty: "vanskelig" },
  { year: 1716, event: "Karl XII forsøker å invadere Norge", category: "norge", difficulty: "vanskelig" },
  { year: 1814, event: "Norge får ny konge — Karl XIII av Sverige etter Mossekonvensjonen", category: "norge", difficulty: "vanskelig" },
  { year: 1905, event: "Haakon VII blir Norges nye konge", category: "norge", difficulty: "middels" },
  { year: 1925, event: "Svalbardtraktaten trer i kraft og øygruppa blir norsk", category: "norge", difficulty: "vanskelig" },
  { year: 1957, event: "Olav V blir konge etter farens død", category: "norge", difficulty: "vanskelig" },
  { year: 1991, event: "Harald V blir konge", category: "norge", difficulty: "middels" },
  { year: 1993, event: "Oslo-avtalen mellom Israel og PLO undertegnes", category: "norge", difficulty: "middels" },

  // === Vitenskap (ekstra) ===
  { year: 1610, event: "Galileo oppdager Jupiters fire største måner", category: "vitenskap", difficulty: "middels" },
  { year: 1632, event: "Galileo utgir Dialog om de to verdenssystemene", category: "vitenskap", difficulty: "vanskelig" },
  { year: 1714, event: "Fahrenheit utvikler kvikksølvtermometeret", category: "vitenskap", difficulty: "vanskelig" },
  { year: 1752, event: "Benjamin Franklins drage-eksperiment med lyn", category: "vitenskap", difficulty: "vanskelig" },
  { year: 1781, event: "William Herschel oppdager Uranus", category: "vitenskap", difficulty: "vanskelig" },
  { year: 1820, event: "Ørsted oppdager sammenhengen mellom elektrisitet og magnetisme", category: "vitenskap", difficulty: "vanskelig" },
  { year: 1869, event: "Mendelejev publiserer det periodiske system", category: "vitenskap", difficulty: "middels" },
  { year: 1888, event: "Heinrich Hertz beviser eksistensen av elektromagnetiske bølger", category: "vitenskap", difficulty: "vanskelig" },
  { year: 1903, event: "Marie Curie blir første kvinne med Nobelpris", category: "vitenskap", difficulty: "middels" },
  { year: 1932, event: "Nøytronet oppdages av James Chadwick", category: "vitenskap", difficulty: "vanskelig" },
  { year: 1942, event: "Første kontrollerte kjedereaksjon — Chicago Pile-1", category: "vitenskap", difficulty: "vanskelig" },
  { year: 1969, event: "ARPANET sender første melding mellom datamaskiner", category: "oppfinnelse", difficulty: "vanskelig" },
  { year: 1971, event: "Den første mikroprosessoren — Intel 4004 — lanseres", category: "oppfinnelse", difficulty: "vanskelig" },
  { year: 1977, event: "Voyager 1 og 2 sendes ut i rommet", category: "vitenskap", difficulty: "middels" },
  { year: 1995, event: "Den første eksoplaneten rundt en sollignende stjerne oppdages", category: "vitenskap", difficulty: "vanskelig" },
  { year: 2000, event: "Det menneskelige genom kartlegges i hovedutkast", category: "vitenskap", difficulty: "middels" },

  // === Oppfinnelser / teknologi ===
  { year: 1455, event: "Gutenberg-bibelen ferdigstilles", category: "oppfinnelse", difficulty: "middels" },
  { year: 1709, event: "Den moderne klaver oppfinnes av Cristofori", category: "oppfinnelse", difficulty: "vanskelig" },
  { year: 1804, event: "Den første dampdrevne lokomotiven kjører i Wales", category: "oppfinnelse", difficulty: "vanskelig" },
  { year: 1837, event: "Morsetelegrafen demonstreres", category: "oppfinnelse", difficulty: "vanskelig" },
  { year: 1888, event: "Kodak lanserer den første enkle filmkameraet for forbrukere", category: "oppfinnelse", difficulty: "vanskelig" },
  { year: 1901, event: "Marconi sender første transatlantiske radiosignal", category: "oppfinnelse", difficulty: "middels" },
  { year: 1947, event: "Transistoren oppfinnes ved Bell Labs", category: "oppfinnelse", difficulty: "middels" },
  { year: 1957, event: "FORTRAN — det første høynivå-programmeringsspråket", category: "oppfinnelse", difficulty: "vanskelig" },
  { year: 1973, event: "Den første mobiltelefonsamtalen", category: "oppfinnelse", difficulty: "vanskelig" },
  { year: 1981, event: "IBM lanserer den første PC-en", category: "oppfinnelse", difficulty: "middels" },
  { year: 1991, event: "Linux-kjernen blir lansert", category: "oppfinnelse", difficulty: "vanskelig" },

  // === Religion / kultur ===
  { year: 1095, event: "Det første korstoget proklameres i Clermont", category: "religion", difficulty: "middels" },
  { year: 1209, event: "Frans av Assisi grunnlegger fransiskanerordenen", category: "religion", difficulty: "vanskelig" },
  { year: 1378, event: "Det store skisma deler den katolske kirke", category: "religion", difficulty: "vanskelig" },
  { year: 1545, event: "Konsilet i Trento — motreformasjonen tar form", category: "religion", difficulty: "vanskelig" },
  { year: 1611, event: "King James-bibelen utgis", category: "religion", difficulty: "vanskelig" },
  { year: 1948, event: "Verdenserklæringen om menneskerettighetene vedtas", category: "politikk", difficulty: "middels" },

  // === 1800-tallet ekstra ===
  { year: 1812, event: "Brødrene Grimm utgir første bind av eventyrene", category: "kultur", difficulty: "vanskelig" },
  { year: 1818, event: "Mary Shelley utgir Frankenstein", category: "kultur", difficulty: "vanskelig" },
  { year: 1830, event: "Jernbanen Liverpool–Manchester åpner", category: "oppfinnelse", difficulty: "vanskelig" },
  { year: 1838, event: "Telegrafen demonstreres offentlig av Morse", category: "oppfinnelse", difficulty: "vanskelig" },
  { year: 1851, event: "Verdensutstillingen i Crystal Palace åpner i London", category: "kultur", difficulty: "vanskelig" },
  { year: 1854, event: "Krimkrigen begynner", category: "krig", difficulty: "vanskelig" },
  { year: 1859, event: "Drillingen av første olje-brønn i Pennsylvania", category: "oppfinnelse", difficulty: "vanskelig" },
  { year: 1869, event: "Den transkontinentale jernbanen i USA fullføres", category: "oppfinnelse", difficulty: "middels" },
  { year: 1883, event: "Vulkanen Krakatau har et katastrofalt utbrudd", category: "verden", difficulty: "middels" },
  { year: 1894, event: "Dreyfus-saken begynner i Frankrike", category: "politikk", difficulty: "vanskelig" },
  { year: 1899, event: "Boerkrigen begynner i Sør-Afrika", category: "krig", difficulty: "vanskelig" },

  // === 1900-tallet ekstra ===
  { year: 1902, event: "Den første hjertekirurgien — sukseesfull lukking av sårskade", category: "vitenskap", difficulty: "vanskelig" },
  { year: 1904, event: "Russisk-japanske krig bryter ut", category: "krig", difficulty: "vanskelig" },
  { year: 1910, event: "Halleys komet er synlig fra jorden", category: "vitenskap", difficulty: "vanskelig" },
  { year: 1916, event: "Påskeopprøret i Dublin", category: "politikk", difficulty: "vanskelig" },
  { year: 1923, event: "Hitlers ølkjellerkupp i München mislykkes", category: "politikk", difficulty: "vanskelig" },
  { year: 1929, event: "Akademy Awards (Oscar) deles ut for første gang", category: "kultur", difficulty: "vanskelig" },
  { year: 1935, event: "Nürnberglovene innføres i Tyskland", category: "politikk", difficulty: "vanskelig" },
  { year: 1942, event: "Wannseekonferansen — Holocaust planlegges", category: "krig", difficulty: "middels" },
  { year: 1945, event: "Konsentrasjonsleirene blir frigjort av allierte", category: "krig", difficulty: "middels" },
  { year: 1946, event: "Nürnbergprosessen avsier dom over nazistiske krigsforbrytere", category: "politikk", difficulty: "middels" },
  { year: 1954, event: "Brown v. Board of Education slår fast at skolesegregering er grunnlovsstridig", category: "politikk", difficulty: "vanskelig" },
  { year: 1959, event: "Hawaii blir USAs 50. delstat", category: "verden", difficulty: "vanskelig" },
  { year: 1962, event: "Marilyn Monroe dør", category: "kultur", difficulty: "middels" },
  { year: 1973, event: "Pink Floyds Dark Side of the Moon utgis", category: "kultur", difficulty: "middels" },
  { year: 1975, event: "Khmer Rouge tar makten i Kambodsja", category: "politikk", difficulty: "middels" },
  { year: 1978, event: "Pave Johannes Paul II blir den første ikke-italienske paven på 455 år", category: "religion", difficulty: "middels" },
  { year: 1982, event: "Michael Jacksons Thriller utgis", category: "kultur", difficulty: "middels" },
  { year: 1989, event: "Ayatollah Khomeini erklærer fatwa mot Salman Rushdie", category: "religion", difficulty: "vanskelig" },
  { year: 1991, event: "Slovenia og Kroatia erklærer uavhengighet", category: "politikk", difficulty: "vanskelig" },
  { year: 1993, event: "Tsjekkoslovakia deles i to fredelig", category: "politikk", difficulty: "middels" },
  { year: 1997, event: "Toy Story 2-produksjonen — Pixar revolusjonerer animasjon (Toy Story var 1995)", category: "kultur", difficulty: "vanskelig" },
  { year: 1999, event: "Matrix har premiere", category: "kultur", difficulty: "middels" },
];

import wikipediaEventsRaw from "./events.json";

type WikipediaEvent = Omit<QuizQuestion, "id">;
const wikipediaEvents = wikipediaEventsRaw as unknown as WikipediaEvent[];

// Lower-case, accent/punct-stripped, single-spaced — used for fuzzy dedup.
function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // diacritics
    .replace(/[^a-zæøå0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Strip year mentions and citation cruft from event text so the question
// doesn't spoil its own answer. Applied to every event regardless of source.
function stripYearMentions(text: string, answerYear: number): string {
  // Decode the small set of HTML entities Wikipedia leaves in plain text.
  // &ndash: with a colon is a real typo we've seen — treat it like the dash.
  let s = text
    .replace(/&ndash[;:]/g, "–")
    .replace(/&mdash[;:]/g, "—")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#?\w+;/g, " ");

  // Trailing citation cruft: ". Hentet 16. februar 2017.", "Wikipedia ...",
  // "Store norske leksikon ...", URLs, etc.
  s = s.replace(
    /\s*[.;]\s*(?:Hentet|Besøkt|Wikipedia|Encyclopædia|Store [Nn]orske [Ll]eksikon|Snl|English Monarchs|Gaski[, ]).*$/u,
    "."
  );
  s = s.replace(/\s*\(besøkt[^)]*\)/gi, "");
  s = s.replace(/https?:\/\/\S+/g, "");

  // Lifespan/span parentheticals: (1019–1074), (ca. 963-1000), (d. 1050),
  // (død 691), (født 1820), (1700-1721)
  s = s.replace(
    /\s*\((?:ca\.?\s*|d\.\s*|død\s+|født\s+)?\d{1,4}(?:\s*[–\-]\s*\d{1,4})?\s*\)/g,
    ""
  );
  // Any other parenthetical that contains a 4-digit year is almost always a
  // year-annotation (e.g. "(Toy Story var 1995)") — drop the whole thing.
  s = s.replace(/\s*\([^)]*\b(?:1\d{3}|20[0-2]\d)\b[^)]*\)/g, "");
  // Leading range "1562–1598: …" or "1768–1771 – …"
  s = s.replace(/^\s*\d{3,4}\s*[–\-]\s*\d{3,4}\s*[:–\-]\s*/u, "");
  // Inline year range "1700–1721" / "(1700-1721"
  s = s.replace(/\s*\(?\d{3,4}\s*[–\-]\s*\d{3,4}\)?/g, "");

  // Range patterns where answer year is one endpoint (e.g. "68-69",
  // "535-536"). Strip ranges before the bare answer-year strip so we don't
  // leave a dangling "-69".
  if (answerYear > 0) {
    const ay = String(answerYear);
    s = s.replace(new RegExp(`\\b${ay}\\s*[–\\-]\\s*\\d{1,4}\\b`, "g"), "");
    s = s.replace(new RegExp(`\\b\\d{1,4}\\s*[–\\-]\\s*${ay}\\b`, "g"), "");
  }

  // "i 1885", "fra 1664", "til 1689", "før år 1000", "etter 1066",
  // "frem til 1689", "rundt 1000", "omkring 800". Restricted to 3–4 digits
  // so we don't strip counts like "rundt 19 000 opprørere" or "etter 18 år".
  // "ca." is excluded because "ca. 300 biskoper" is a count, not a year.
  s = s.replace(
    /\s+(?:[Ii]|fra|til|før|etter|innen|frem\s+til|rundt|omkring)\s+(?:år\s+)?\d{3,4}\b/gu,
    ""
  );
  // "fra NN til dette året" / "fra NN til NN" — Wikipedia stub cruft for
  // short pre-1000 years that the broader preposition strip doesn't catch.
  s = s.replace(/\s+fra\s+\d{1,4}\s+til\s+(?:dette\s+året|\d{1,4})\b/giu, "");
  // Sentence-leading "I 1624 …" / "I 645 …" / "År 1066 …"
  s = s.replace(/^(?:I|År)\s+(?:år\s+)?\d{1,4}\b\s*,?\s*/u, "");
  // "år NNNN" generically
  s = s.replace(/\s+år\s+\d{3,4}\b/gu, "");
  // "ca. NNNN" only when the number is a plausible year (4-digit)
  s = s.replace(/\s+(?:cirka|ca\.?)\s+\d{4}\b/giu, "");

  // Dates like "10. juni 1940", "16. februar 2017" — drop the trailing year
  s = s.replace(
    /(\b\d{1,2}\.\s*(?:januar|februar|mars|april|mai|juni|juli|august|september|oktober|november|desember))\s+\d{3,4}\b/giu,
    "$1"
  );

  // Solitary year in parens: "Slaget om København (1807)"
  s = s.replace(/\s*\(\d{3,4}\)/g, "");

  // Bare answer year (handles whatever's left, including 1–3 digit cases)
  if (answerYear > 0) {
    s = s.replace(new RegExp(`\\b${answerYear}\\b`, "g"), "");
  }
  // Final pass: any remaining 4-digit year (1000–2099) — bare numbers
  s = s.replace(/\b(?:1\d{3}|20[0-2]\d)\b/g, "");

  // Cleanup: empty parens, dangling punctuation, doubled spaces
  s = s.replace(/\([^)]*\b(?:død|født|d\.|ca\.)\s*\)/g, "");
  s = s.replace(/\(\s*\)/g, "");
  s = s.replace(/\s+([,.;:!?])/g, "$1");
  s = s.replace(/\s{2,}/g, " ");
  // Trailing "(" left from "Den store nordiske krig 1700-1721)" cleanups
  s = s.replace(/\s+\)/g, "");
  s = s.replace(/^[\s,.;:–\-—]+/u, "");
  s = s.replace(/[\s,;:]+\.$/u, ".");
  // Drop dangling sentence-final prepositions left after a stripped year.
  // Lowercase-only to avoid stripping the roman numeral "I" (e.g. "Pave Klemens I.").
  // "etter" is excluded because of the adverbial "året etter".
  s = s.replace(/\s+(?:i|fra|til|før|innen|rundt|omkring|frem til)([.,;:]?)\s*$/u, "$1");
  // Collapse accidental duplicated consecutive words ("Pave Pave", "i i", "er er").
  // Case-sensitive on purpose: "Pave Klemens I i Roma" must not collapse "I i"
  // because "I" is a roman numeral and "i" is the preposition.
  s = s.replace(/\b([\p{L}]+)\s+\1\b/gu, "$1");
  s = s.trim();

  return s;
}

// Build the final dataset by combining the curated list (priority) with the
// Wikipedia-sourced events. Curated entries win on duplicate keys, and
// Wikipedia entries that closely overlap a curated entry from the same year
// are dropped to avoid near-duplicates.
function buildDataset(): QuizQuestion[] {
  const seenKeys = new Set<string>();
  const result: Omit<QuizQuestion, "id">[] = [];
  const curatedByYear = new Map<number, string[]>();

  for (const c of raw) {
    const key = `${c.year}|${norm(c.event).slice(0, 50)}`;
    if (seenKeys.has(key)) continue;
    seenKeys.add(key);
    result.push(c);
    const list = curatedByYear.get(c.year) ?? [];
    list.push(norm(c.event));
    curatedByYear.set(c.year, list);
  }

  for (const w of wikipediaEvents) {
    const wn = norm(w.event);
    if (wn.length < 12) continue;
    const key = `${w.year}|${wn.slice(0, 50)}`;
    if (seenKeys.has(key)) continue;

    // Cross-check against curated events of the same year.
    const sameYear = curatedByYear.get(w.year);
    if (sameYear) {
      const isDup = sameYear.some((cn) => {
        const head = cn.slice(0, 30);
        return head.length >= 20 && wn.includes(head);
      });
      if (isDup) continue;
    }

    seenKeys.add(key);
    result.push(w);
  }

  // Stable sort by year, then by event text — keeps history page readable.
  result.sort((a, b) =>
    a.year - b.year || a.event.localeCompare(b.event, "nb"),
  );

  return result
    .map((q) => ({ ...q, event: stripYearMentions(q.event, q.year) }))
    .filter((q) => q.event.length >= 8)
    .map((q, i) => ({ ...q, id: i + 1 }));
}

export const QUESTIONS: QuizQuestion[] = buildDataset();
export const TOTAL_QUESTIONS = QUESTIONS.length;
