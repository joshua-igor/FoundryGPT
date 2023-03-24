export function pf2eContext(author) {
    let char = author.user.character;
    let systemPrompt
    if (author.isGM) {
        systemPrompt = "I'm playing as the GM."
    }else{
        systemPrompt = `My character's name is ${char.name}, ${char.system.details.gender.value} is a ${char.heritage.name} ${char.ancestry.name} ${char.background.name}, level ${char.system.details.level.value} ${char.class.name}, ${char.deity.name} worshiper.`
    }
    return systemPrompt
}