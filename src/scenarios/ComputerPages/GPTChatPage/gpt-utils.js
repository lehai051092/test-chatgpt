
export function playGifPersonaAction(avatarKey, actionName, play) {
    switch (actionName) {
        case 'クチパク':
            play(avatarKey, 'Talking')
            break;
        case 'くちぱく':
            play(avatarKey, 'Talking')
            break;
        case 'はい':
            play(avatarKey, 'Nod')
            break;
        case 'いいえ':
            play(avatarKey, 'Shake')
            break;
        case '悩む':
            play(avatarKey, 'Worry')
            break;
        case '疑問':
            play(avatarKey, 'Wonder')
            break;
        case '喜び':
            play(avatarKey, 'Pleasure')
            break;
        case '不満':
            play(avatarKey, 'Complaint')
            break;
        case '安心':
            play(avatarKey, 'Relief')
            break;
        default:
            break;
    }
}

export function personaActionNameToKey(actionName) {
    switch (actionName) {
        case 'クチパク':
            return 'Talking'
        case 'くちぱく':
            return 'Talking'
        case 'はい':
            return 'Nod'
        case 'いいえ':
            return 'Shake'
        case '悩む':
            return 'Worry'
        case '疑問':
            return 'Wonder'
        case '喜び':
            return 'Pleasure'
        case '不満':
            return 'Complaint'
        case '安心':
            return 'Relief'
        default:
            return ''
    }
}

export function personaActionEmotion(actionName) {
    switch (actionName) {
        case '悩む':
            return '悩む'
        case '疑問':
            return '疑問'
        case '喜び':
            return '喜び'
        case '不満':
            return '不満'
        case '安心':
            return '安心'
        case 'はい':
        case 'いいえ':
        case 'クチパク':
            return '平常'
        default:
            return ''
    }
}