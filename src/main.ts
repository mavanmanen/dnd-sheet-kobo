type AbilityScore = import('./models/ability-score').AbilityScore
type CharacterInfo = import('./models/character-info').CharacterInfo
type Proficiencies = import('./models/proficiencies').Proficiencies
type Feature = import('./models/feature').Feature
type Sheet = import('./models/sheet').Sheet
type Skill = import('./models/skill').Skill
type Attack = import('./models/attack').Attack
type EquipmentItem = import('./models/equipment-item').Equipment
type $ = typeof import('jquery')

function getJson(url: string): Sheet {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, false)
    xhr.send()
    return JSON.parse(xhr.response)
}

function getAbilityModifier(score: number): number {
    return Math.floor((score - 10) / 2)
}

function formatAbilityModifier(score: number): string {
    return score > 0 ? `+${score}` : String(score)
}

function toCheck(value: Boolean): string {
    return value ? 'x' : '-'
}

function setCharacterInfo(characterInfo: CharacterInfo) {
    $('#character-name').text(characterInfo.name)
    $('#class').text(characterInfo.class)
    $('#level').text(characterInfo.level)
    $('#race').text(characterInfo.race)
    $('#background').text(characterInfo.background)
    $('#alignment').text(characterInfo.alignment)
    $('#experience-points').text(characterInfo.experiencePoints)
}

function setAbilityScores(abilityScores: Array<AbilityScore>) {
    for(const abilityScore of abilityScores) {
        const el = $(`#ability-score-${abilityScore.name.toLowerCase()}`)
        el.find('.modifier').text(formatAbilityModifier(getAbilityModifier(abilityScore.score)))
        el.find('.score').text(abilityScore.score)
    }
}

function setSavingThrows(abilityScores: Array<AbilityScore>, proficiencyBonus: number) {
    for(const abilityScore of abilityScores) {
        const el = $(`#saving-throw-${abilityScore.name.toLowerCase()}`)
        let score = getAbilityModifier(abilityScore.score)
        if(abilityScore.proficiency) {
            score += proficiencyBonus
        }
        el.find('.proficiency').text(toCheck(abilityScore.proficiency))
        el.find('.value').text(formatAbilityModifier(score))
    }
}

function getAbilityForSkill(skillName: string, abilities: Array<AbilityScore>): AbilityScore {
    switch(skillName) {
        case 'Athletics':
            return abilities.filter(el => el.name == 'Strength')[0]

        case 'Acrobatics':
        case 'Sleight of Hand':
        case 'Stealth':
            return abilities.filter(el => el.name == 'Dexterity')[0]

        case 'Arcana':
        case 'History':
        case 'Investigation':
        case 'Nature':
        case 'Religion':
            return abilities.filter(el => el.name == 'Intelligence')[0]

        case 'Animal Handling':
        case 'Insight':
        case 'Medicine':
        case 'Perception':
        case 'Survival':
            return abilities.filter(el => el.name == 'Wisdom')[0]

        case 'Deception':
        case 'Intimidation':
        case 'Performance':
        case 'Persuasion':
            return abilities.filter(el => el.name == 'Charisma')[0]

        default: return null;
    }
}

function setSkills(skills: Array<Skill>, proficiencyBonus: number, abilities: Array<AbilityScore>) { 
    for(const skill of skills) {
        const el = $(`#skill-${skill.name.toLowerCase().replace(/\s/g, '-')}`)
        const ability = getAbilityForSkill(skill.name, abilities)
        let score = getAbilityModifier(ability.score)
        if(skill.proficiency) {
            score += proficiencyBonus
        }
        if(skill.expertise) {
            score += proficiencyBonus
        }
        el.find('.proficiency').text(toCheck(skill.proficiency))
        el.find('.expertise').text(toCheck(skill.expertise))
        el.find('.value').text(formatAbilityModifier(score))
    }
}

function setPassiveWisdom(skills: Array<Skill>, proficiencyBonus: number, abilities: Array<AbilityScore>) {
    const perception = skills.filter(el => el.name == 'Perception')[0]
    const abilityScore = getAbilityForSkill('Perception', abilities)
    var score = 10 + getAbilityModifier(abilityScore.score)
    if(perception.proficiency) {
        score += proficiencyBonus
    }
    if(perception.expertise) {
        score += proficiencyBonus
    }
    $('#passive-wisdom .value').text(formatAbilityModifier(score))
}

function populateList(selector: string, data: Array<string>) {
    const el = $(selector)
    for(const d of data) {
        el.append($(`<li>${d}</li>`))
    }
}

function setProficiencies(proficiencies: Proficiencies) {
    populateList('#proficiency-languages ol', proficiencies.languages)
    populateList('#proficiency-armor ol', proficiencies.armor)
    populateList('#proficiency-weapons ol', proficiencies.weapons)
    populateList('#proficiency-tools ol', proficiencies.tools)
}

function setAttacks(attacks: Array<Attack>, abilities: Array<AbilityScore>) {
    const el = $('#attacks .items')
    const str = abilities.filter(el => el.name == 'Strength')[0]
    const dex = abilities.filter(el => el.name == 'Dexterity')[0]


    for(const attack of attacks) {
        const score = attack.finesse ? dex : str
        const mod = getAbilityModifier(score.score)

        el.append($(`
            <tr>
                <td>${toCheck(attack.finesse)}</td>
                <td class='left'>${attack.name}</td>
                <td class='right'>${formatAbilityModifier(mod)}</td>
                <td class='right'>${attack.damage}</td>
                <td class='right'>${formatAbilityModifier(mod)}</td>
            </tr>
        `))
    }
}

function setFeaturesAndTraits(data: Array<Feature>) {
    const el = $('#features-traits .items')
    for(const ft of data) {
        el.append($(`
            <tr>
                <th class='left'>${ft.name}</th>
            </tr>
            <tr>
                <td>${ft.description}</td>
            </tr>
        `))
    }
}

function setEquipment(data: Array<EquipmentItem>) {
    const el = $('#equipment')
    for(const eq of data) {
        el.append($(`
            <tr>
                <td>${eq.name}</td>
                <td class='right'>${eq.amount}</td>
            </tr>
        `))
    }
}

function setDeathSaves(successes: Array<Boolean>, failures: Array<Boolean>) {
    const s = successes.filter(x => x).length
    const f = failures.filter(x => x).length
    $('#death-saves .value').text(`${s}/${f}`)
}

function setArmorClass(armor: string, shield: Boolean) {
    let ac = shield ? 2 : 0
    switch(armor.toLowerCase()) {
        case 'padded':
        case 'leather':
            ac += 11;
            break

        case 'studded leather':
        case 'hide':
            ac += 12;
            break
        
        case 'chainshirt':
            ac += 13;
            break
        
        case 'scalemail':
        case 'breastplate':
        case 'ringmail':
            ac += 14;
            break

        case 'halfplate':
            ac += 15
            break
        
        case 'chainmail':
            ac += 16
            break
        
        case 'splint':
            ac += 17
            break

        case 'plate':
            ac += 18
            break
    }

    $('#armor-class .value').text(ac)
}

document.addEventListener('DOMContentLoaded', (e) => {
    const data: Sheet = getJson('!{sheetUrl}')

    setCharacterInfo(data.characterInfo)
    setAbilityScores(data.abilityScores)
    $('#inspiration .value').text(data.inspiration)
    $('#proficiency-bonus .value').text(data.proficiencyBonus)
    setSavingThrows(data.abilityScores, data.proficiencyBonus)
    setSkills(data.skills, data.proficiencyBonus, data.abilityScores)
    setPassiveWisdom(data.skills, data.proficiencyBonus, data.abilityScores)
    setProficiencies(data.proficiencies)
    setAttacks(data.attacks, data.abilityScores)
    const dex = data.abilityScores.filter(el => el.name == 'Dexterity')[0]
    setArmorClass(data.armor, data.shield)
    $('#initiative .value').text(getAbilityModifier(dex.score))
    $('#speed .value').text(data.speed)
    $('#max-hp .value').text(data.maximumHitpoints)
    $('#cur-hp .value').text(data.currentHitpoints)
    $('#temp-hp .value').text(data.temporaryHitpoints)
    $('#max-hit-dice .value').text(data.hitDiceTotal)
    $('#cur-hit-dice .value').text(data.hitDice)
    setDeathSaves(data.deathSaveSuccesses, data.deathSaveFailures)
    setEquipment(data.equipment)
    $('#currency-copper .value').text(data.currency.copper)
    $('#currency-silver .value').text(data.currency.silver)
    $('#currency-electrum .value').text(data.currency.electrum)
    $('#currency-gold .value').text(data.currency.gold)
    $('#currency-platinum .value').text(data.currency.platinum)
    $('#personality-traits .text').text(data.personalityTraits)
    $('#ideals .text').text(data.ideals)
    $('#bonds .text').text(data.bonds)
    $('#flaws .text').text(data.flaws)
    setFeaturesAndTraits(data.features)
})