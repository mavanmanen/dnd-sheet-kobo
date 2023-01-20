function getJson(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send();
    return JSON.parse(xhr.response);
}
function setValue(valueContainerId, value) {
    document.querySelector("#".concat(valueContainerId, " .value")).innerHTML = value;
}
function setCharacterInfo(characterInfo) {
    setValue('player-name', characterInfo.playerName);
    setValue('character-name', characterInfo.name);
    setValue('class', characterInfo["class"]);
    setValue('level', characterInfo.level);
    setValue('race', characterInfo.race);
    setValue('background', characterInfo.background);
    setValue('alignment', characterInfo.alignment);
    setValue('experience-points', characterInfo.experiencePoints);
}
function getAbilityModifier(score) {
    return Math.floor((score - 10) / 2);
}
function setAbilityScore(abilityScore) {
    var el = document.getElementById("ability-score-".concat(abilityScore.name.toLowerCase()));
    el.querySelector('.value').innerHTML = String(abilityScore.score);
    el.querySelector('.modifier').innerHTML = String(getAbilityModifier(abilityScore.score));
}
function setAbilityScores(abilityScores) {
    abilityScores.forEach(setAbilityScore);
}
function setSavingThrow(abilityScore, proficiencyBonus) {
    var el = document.getElementById("saving-throw-".concat(abilityScore.name.toLowerCase()));
    var score = getAbilityModifier(abilityScore.score);
    if (abilityScore.proficiency) {
        score += proficiencyBonus;
    }
    el.querySelector('.value').innerHTML = String(score);
    el.querySelector('.proficiency').innerHTML = abilityScore.proficiency ? 'x' : '-';
}
function setSavingThrows(abilityScores, proficiencyBonus) {
    abilityScores.forEach(function (as) { return setSavingThrow(as, proficiencyBonus); });
}
function getAbilityForSkill(skillName, abilities) {
    switch (skillName) {
        case 'Athletics':
            return abilities.filter(function (el) { return el.name == 'Strength'; })[0];
        case 'Acrobatics':
        case 'Sleight of Hand':
        case 'Stealth':
            return abilities.filter(function (el) { return el.name == 'Dexterity'; })[0];
        case 'Arcana':
        case 'History':
        case 'Investigation':
        case 'Nature':
        case 'Religion':
            return abilities.filter(function (el) { return el.name == 'Intelligence'; })[0];
        case 'Animal Handling':
        case 'Insight':
        case 'Medicine':
        case 'Perception':
        case 'Survival':
            return abilities.filter(function (el) { return el.name == 'Wisdom'; })[0];
        case 'Deception':
        case 'Intimidation':
        case 'Performance':
        case 'Persuasion':
            return abilities.filter(function (el) { return el.name == 'Charisma'; })[0];
        default: return null;
    }
}
function setSkill(skill, proficiencyBonus, abilities) {
    var el = document.getElementById("skill-".concat(skill.name.toLowerCase().replace(/\s/g, '-')));
    var abilityScore = getAbilityForSkill(skill.name, abilities);
    var score = getAbilityModifier(abilityScore.score);
    if (skill.proficiency) {
        score += proficiencyBonus;
    }
    if (skill.expertise) {
        score += proficiencyBonus;
    }
    el.querySelector('.value').innerHTML = String(score);
    el.querySelector('.proficiency').innerHTML = skill.proficiency ? 'x' : '-';
    el.querySelector('.expertise').innerHTML = skill.expertise ? 'x' : '-';
}
function setSkills(skills, proficiencyBonus, abilities) {
    skills.forEach(function (skill) { return setSkill(skill, proficiencyBonus, abilities); });
}
function setPassiveWisdom(skills, proficiencyBonus, abilities) {
    var perception = skills.filter(function (el) { return el.name == 'Perception'; })[0];
    var abilityScore = getAbilityForSkill('Perception', abilities);
    var score = 10 + getAbilityModifier(abilityScore.score);
    if (perception.proficiency) {
        score += proficiencyBonus;
    }
    if (perception.expertise) {
        score += proficiencyBonus;
    }
    setValue('passive-wisdom', String(score));
}
function populateList(selector, data) {
    var el = document.querySelector(selector);
    data.forEach(function (d) {
        var ol = document.createElement('ol');
        ol.innerText = d;
        el.appendChild(ol);
    });
}
function setProficiencies(proficiencies) {
    populateList('#proficiency-languages ol', proficiencies.languages);
    populateList('#proficiency-armor ol', proficiencies.armor);
    populateList('#proficiency-weapons ol', proficiencies.weapons);
    populateList('#proficiency-tools ol', proficiencies.tools);
}
document.addEventListener('DOMContentLoaded', function (e) {
    var data = getJson('https://gist.githubusercontent.com/mavanmanen/90895bfc5e342785cc4111477492b5c7/raw/Veil%2520of%2520Shadows.json');
    setCharacterInfo(data.characterInfo);
    setAbilityScores(data.abilityScores);
    setValue('inspiration', String(data.inspiration));
    setValue('proficiency-bonus', String(data.proficiencyBonus));
    setSavingThrows(data.abilityScores, data.proficiencyBonus);
    setSkills(data.skills, data.proficiencyBonus, data.abilityScores);
    setPassiveWisdom(data.skills, data.proficiencyBonus, data.abilityScores);
    setProficiencies(data.proficiencies);
});
setValue('player-name', 'test');
