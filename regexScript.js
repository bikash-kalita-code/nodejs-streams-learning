let target = '1003013442,3870770142,I20110614000599,KAN,JACK,M,,M,,WAYNE STATE UNIVERSITY SCHOOL OF MEDICINE,2007,ANESTHESIOLOGY,,,,,,,"NEWPORT HARBOR ANESTHESIA CONSULTANTS MEDICAL GROUP, INC.",1759284771,72,ONE HOAG DR,,,NEWPORT BEACH,CA,926634162,9496458600,Y,Y,CA926634162NEONEXXDRXX30';

const resultArray = target.match(/"[\w\W]*"/gi);
// for(let result of resultArray) {
//     console.log(result);
//     const temp = result.replaceAll(',', 'REPLACETEXT');
//     console.log(temp);
//     const resultFinal = temp.replaceAll('REPLACETEXT', ',');
//     console.log(resultFinal);
//     console.log(result === resultFinal);
// }

for(result of resultArray) {
    console.log(target);
    const temp = result.replaceAll(',', 'REPLACETEXT');
    target = target.replaceAll(result, temp);
    console.log(target);
}