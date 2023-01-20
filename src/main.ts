type AbilityScore = import('./models/ability-score').AbilityScore
type CharacterInfo = import('./models/character-info').CharacterInfo
type Proficiencies = import('./models/proficiencies').Proficiencies
type Sheet = import('./models/sheet').Sheet
type Skill = import('./models/skill').Skill

function getJson(url: string): Sheet {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, false)
    xhr.send()
    return JSON.parse(xhr.response)
}

function setValue(valueContainerId: string, value: string) {
    document.querySelector(`#${valueContainerId} .value`).innerHTML = value
}

function setCharacterInfo(characterInfo: CharacterInfo) {
    setValue('player-name', characterInfo.playerName)
    setValue('character-name', characterInfo.name)
    setValue('class', characterInfo.class)
    setValue('level', characterInfo.level)
    setValue('race', characterInfo.race)
    setValue('background', characterInfo.background)
    setValue('alignment', characterInfo.alignment)
    setValue('experience-points', characterInfo.experiencePoints)
}

function getAbilityModifier(score: number): number {
    return Math.floor((score - 10) / 2)
}

function setAbilityScore(abilityScore: AbilityScore) {
    const el = document.getElementById(`ability-score-${abilityScore.name.toLowerCase()}`)
    el.querySelector('.value').innerHTML = String(abilityScore.score)
    el.querySelector('.modifier').innerHTML = String(getAbilityModifier(abilityScore.score))
}

function setAbilityScores(abilityScores: Array<AbilityScore>) {
    abilityScores.forEach(setAbilityScore)
}

function setSavingThrow(abilityScore: AbilityScore, proficiencyBonus: number) {
    const el = document.getElementById(`saving-throw-${abilityScore.name.toLowerCase()}`)
    var score = getAbilityModifier(abilityScore.score)
    if(abilityScore.proficiency) {
        score += proficiencyBonus
    }
    el.querySelector('.value').innerHTML = String(score)
    el.querySelector('.proficiency').innerHTML = abilityScore.proficiency ? 'x' : '-'
}

function setSavingThrows(abilityScores: Array<AbilityScore>, proficiencyBonus: number) {
    abilityScores.forEach(as => setSavingThrow(as, proficiencyBonus))
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

function setSkill(skill: Skill, proficiencyBonus: number, abilities: Array<AbilityScore>) {
    const el = document.getElementById(`skill-${skill.name.toLowerCase().replace(/\s/g, '-')}`)
    const abilityScore = getAbilityForSkill(skill.name, abilities)
    var score = getAbilityModifier(abilityScore.score)
    if(skill.proficiency) {
        score += proficiencyBonus
    }
    if(skill.expertise) {
        score += proficiencyBonus
    }
    el.querySelector('.value').innerHTML = String(score)
    el.querySelector('.proficiency').innerHTML = skill.proficiency ? 'x' : '-'
    el.querySelector('.expertise').innerHTML = skill.expertise ? 'x' : '-'
}

function setSkills(skills: Array<Skill>, proficiencyBonus: number, abilities: Array<AbilityScore>) { 
    skills.forEach(skill => setSkill(skill, proficiencyBonus, abilities))
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
    setValue('passive-wisdom', String(score))
}

function populateList(selector: string, data: Array<string>) {
    const el = document.querySelector(selector)
    data.forEach(d => {
        const ol = document.createElement('ol')
        ol.innerText = d
        el.appendChild(ol)
    })
}

function setProficiencies(proficiencies: Proficiencies) {
    populateList('#proficiency-languages ol', proficiencies.languages)
    populateList('#proficiency-armor ol', proficiencies.armor)
    populateList('#proficiency-weapons ol', proficiencies.weapons)
    populateList('#proficiency-tools ol', proficiencies.tools)
}

document.addEventListener('DOMContentLoaded', (e) => {
    const data: Sheet = getJson('https://gist.githubusercontent.com/mavanmanen/90895bfc5e342785cc4111477492b5c7/raw/Veil%2520of%2520Shadows.json')

    setCharacterInfo(data.characterInfo)
    setAbilityScores(data.abilityScores)
    setValue('inspiration', String(data.inspiration))
    setValue('proficiency-bonus', String(data.proficiencyBonus))
    setSavingThrows(data.abilityScores, data.proficiencyBonus)
    setSkills(data.skills, data.proficiencyBonus, data.abilityScores)
    setPassiveWisdom(data.skills, data.proficiencyBonus, data.abilityScores)
    setProficiencies(data.proficiencies)
})

setValue('player-name', 'test')
