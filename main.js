Array.prototype.find = function(callback) {
    for(var i = 0; i < this.length; i++) {
        const el = this[i]
        if(callback(el)) {
            return el
        }
    }
}

function getJson(url) {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, false)
    xhr.send()
    return JSON.parse(xhr.response)
}

function setValue(valueContainerId, value) {
    document.querySelector('#' + valueContainerId + ' .value').innerHTML = value
}

function setCharacterInfo(characterInfo) {
    setValue('player-name', characterInfo.playerName)
    setValue('character-name', characterInfo.name)
    setValue('class', characterInfo.class)
    setValue('level', characterInfo.level)
    setValue('race', characterInfo.race)
    setValue('background', characterInfo.background)
    setValue('alignment', characterInfo.alignment)
    setValue('experience-points', characterInfo.experiencePoints)
}

function getAbilityModifier(score) {
    return Math.floor((score - 10) / 2)
}

function setAbilityScore(abilityScore) {
    const el = document.getElementById('ability-score-' + abilityScore.name.toLowerCase())
    el.querySelector('.value').innerHTML = abilityScore.score
    el.querySelector('.modifier').innerHTML = getAbilityModifier(abilityScore.score)
}

function setAbilityScores(abilityScores) {
    abilityScores.forEach(setAbilityScore)
}

function setSavingThrow(abilityScore, proficiencyBonus) {
    const el = document.getElementById('saving-throw-' + abilityScore.name.toLowerCase())
    var score = getAbilityModifier(abilityScore.score)
    if(abilityScore.proficiency) {
        score += proficiencyBonus
    }
    el.querySelector('.value').innerHTML = score
    el.querySelector('.proficiency').innerHTML = abilityScore.proficiency ? 'x' : '-'
}

function setSavingThrows(abilityScores, proficiencyBonus) {
    abilityScores.forEach(function(as) {
        setSavingThrow(as, proficiencyBonus)
    })
}

function getAbilityForSkill(skillName, abilities) {
    switch(skillName) {
        case 'Athletics':
            return abilities.find(function(el) {
                return el.name == 'Strength'
            })

        case 'Acrobatics':
        case 'Sleight of Hand':
        case 'Stealth':
            return abilities.find(function(el) {
                return el.name == 'Dexterity'
            })

        case 'Arcana':
        case 'History':
        case 'Investigation':
        case 'Nature':
        case 'Religion':
            return abilities.find(function(el) {
                return el.name == 'Intelligence'
            })

        case 'Animal Handling':
        case 'Insight':
        case 'Medicine':
        case 'Perception':
        case 'Survival':
            return abilities.find(function(el) {
                return el.name == 'Wisdom'
            })

        case 'Deception':
        case 'Intimidation':
        case 'Performance':
        case 'Persuasion':
            return abilities.find(function(el) {
                return el.name == 'Charisma'
            })

        default: return null;
    }
}

function setSkill(skill, proficiencyBonus, abilities) {
    const el = document.getElementById('skill-' + skill.name.toLowerCase().replace(/\s/g, '-'))
    const abilityScore = getAbilityForSkill(skill.name, abilities)
    var score = getAbilityModifier(abilityScore.score)
    if(skill.proficiency) {
        score += proficiencyBonus
    }
    if(skill.expertise) {
        score += proficiencyBonus
    }
    el.querySelector('.value').innerHTML = score
    el.querySelector('.proficiency').innerHTML = skill.proficiency ? 'x' : '-'
    el.querySelector('.expertise').innerHTML = skill.expertise ? 'x' : '-'
}

function setSkills(skills, proficiencyBonus, abilities) { 
    skills.forEach(function(skill) {
        setSkill(skill, proficiencyBonus, abilities)
    })
}

function setPassiveWisdom(skills, proficiencyBonus, abilities) {
    const perception = skills.find(function(el) {
        return el.name == 'Perception'
    })
    const abilityScore = getAbilityForSkill('Perception', abilities)
    var score = 10 + getAbilityModifier(abilityScore.score)
    if(perception.proficiency) {
        score += proficiencyBonus
    }
    if(perception.expertise) {
        score += proficiencyBonus
    }
    setValue('passive-wisdom', score)
}

function populateList(selector, data) {
    const el = document.querySelector(selector)
    for(var i = 0; i < data.length; i++) {
        const ol = document.createElement('ol')
        ol.innerText = data[i]
        el.appendChild(ol)
    }
}

function setProficiencies(proficiencies) {
    populateList('#proficiency-languages ol', proficiencies.languages)
    populateList('#proficiency-armor ol', proficiencies.armor)
    populateList('#proficiency-weapons ol', proficiencies.weapons)
    populateList('#proficiency-tools ol', proficiencies.tools)
}

document.addEventListener('DOMContentLoaded', function(e) {
    const data = getJson('https://gist.githubusercontent.com/mavanmanen/90895bfc5e342785cc4111477492b5c7/raw/Veil%2520of%2520Shadows.json')

    setCharacterInfo(data.characterInfo)
    setAbilityScores(data.abilityScores)
    setValue('inspiration', data.inspiration)
    setValue('proficiency-bonus', data.proficiencyBonus)
    setSavingThrows(data.abilityScores, data.proficiencyBonus)
    setSkills(data.skills, data.proficiencyBonus, data.abilityScores)
    setPassiveWisdom(data.skills, data.proficiencyBonus, data.abilityScores)
    setProficiencies(data.proficiencies)
})

setValue('player-name', 'test')
