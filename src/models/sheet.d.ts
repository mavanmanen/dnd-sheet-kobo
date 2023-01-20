import { CharacterInfo } from "./character-info"
import { AbilityScore } from "./ability-score"
import { Skill } from "./skill"
import { Currency } from "./currency"
import { Equipment } from "./equipment-item"
import { Attack } from "./attack"
import { Feature } from "./feature"
import { Proficiencies } from "./proficiencies"
import { Note } from "./note"

export interface Sheet {
    characterInfo: CharacterInfo
    abilityScores: Array<AbilityScore> 
    inspiration: number
    proficiencyBonus: number
    skills: Array<Skill>
    armor: string
    shield: boolean
    speed: number
    maximumHitpoints: number
    currentHitpoints: number
    temporaryHitpoints: number
    hitDiceTotal: string
    hitDice: string
    deathSaveSuccesses: Array<boolean>
    deathSaveFailures: Array<boolean>
    currency: Currency
    equipment: Array<Equipment>
    personalityTraits: string
    ideals: string
    bonds: string
    flaws: string
    attacks: Array<Attack>
    features: Array<Feature>
    proficiencies: Proficiencies
    notes: Array<Note>  
}