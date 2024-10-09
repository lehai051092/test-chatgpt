/**
 * @description this file offers the mapping relation between persona and all it's images
 * @since 2021/09/29
 */

 import store from '../storage';
 import { isDevOrLocalEnv, runtime } from './runtime';
 
 let personaIdList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 13, 14, 16, 17, 18, 19];
 // these codes are for persona code in different environment, for example, dev is 22, 23, dev2 is 28, 29
 let tempPersonaList = [22, 23, 25, 26, 27, 28, 29];
 // for test persona code
 if(isDevOrLocalEnv()){
     personaIdList = [...personaIdList, ...tempPersonaList];
 }
 function getUniquePersonaCode(personaId){
     let uniqueCode;
     if(personaId && personaIdList.includes(personaId)){
         switch(personaId){
             case 1:
             case 4:
             case 18:
             case 27:
                 uniqueCode = 1;
                 break;
             case 2:
             case 5:
                 uniqueCode = 2;
                 break;
             case 3:
             case 9:
             case 19:
             case 28:
                 uniqueCode = 3;
                 break;
             case 6:
                 uniqueCode = 6;
                 break;
             case 7:
             case 17:
             case 26:
                 uniqueCode = 7;
                 break;
             case 8:
             case 14:
             case 23:
             case 29:
                 uniqueCode = 8;
                 break;
             case 13:
             case 22:
                 uniqueCode = 13;
                 break;
             case 16:
             case 25:
                 uniqueCode = 16;
                 break;
             default:
                 uniqueCode = 1;
                 break;
         }
 
         if(!uniqueCode){
             uniqueCode = 1;
         }
         return uniqueCode;
     }
 }
 
 function getCurrentUniquePersonaCode(){
     let currentId = store.getState().currentChosedPersona ? store.getState()?.currentChosedPersona?.id : 1;
     return getUniquePersonaCode(currentId);
 }

 //  307 male2 308 female1 309 male1
 const speakerMapping = {
     '0S_F':308,
     '20S_F':308,
     '20S_M':309,
     '30S_F':308,
     '30S_M':309,
     '40S_F_a':308,
     '40S_M':309,
     '40S_F_b':308,
     '50S_M':309,
     '50S_F':308,
     '60S_M':307,

 }
 
 function getSpeakerId(id){
    return speakerMapping[id]?speakerMapping[id]:309;
 }
 
 export {
     getSpeakerId,
     getCurrentUniquePersonaCode
 }