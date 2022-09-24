/** @format */

const noteMap = {
    65.41: 'C',
    69.3: 'C#',
    73.42: 'D',
    77.78: 'D#',
    82.41: 'E',
    87.31: 'F',
    92.5: 'F#',
    98.0: 'G',
    103.83: 'G#',
    110.0: 'A',
    116.54: 'A#',
    123.47: 'B',
    130.81: 'c',
    138.59: 'c#',
    146.83: 'd',
    155.56: 'd#',
    164.81: 'e',
    174.61: 'f',
    185.0: 'f#',
    196.0: 'g',
    207.65: 'g#',
    220.0: 'a',
    233.08: 'a#',
    246.94: 'b',
    261.63: 'c1',
    277.18: 'c#1',
    293.67: 'd1',
    311.12: 'd#1',
    329.63: 'e1',
    349.23: 'f1',
    370.0: 'f#1',
    392.0: 'g1',
    415.31: 'g#1',
    440.0: 'a1',
    466.16: 'a#1',
    493.89: 'b1',
    523.25: 'c2',
    554.37: 'c#2',
    587.33: 'd2',
    622.25: 'd#2',
    659.26: 'e2',
    698.46: 'f2',
    739.99: 'f#2',
    783.99: 'g2',
    830.61: 'g#2',
    880.0: 'a2',
    932.33: 'a#2',
    987.77: 'b2',
}

// const noteMapArray=[65.41, 69.3, 73.42, 77.78, 82.41, 87.31, 92.5, 98, 103.83, 110, 116.54, 123.47, 130.81, 138.59, 146.83, 155.56, 164.81, 174.61, 185, 196, 207.65, 220, 233.08, 246.94, 261.63, 277.18, 293.67, 311.12, 329.63, 349.23, 370, 392, 415.31, 440, 466.16, 493.89, 523.25, 554.37, 587.33, 622.25, 659.26, 698.46, 739.99, 783.99, 830.61, 880, 932.33, 987.77]

// function noteMap2IndexMap(){
//   return Object.entries(noteMap).sort((a,b)=>{
//             return a[0]-b[0]
//           }).reduce((prev,cur,index)=>{
//             return {...prev,[index+1]: Number(cur[0])}
//           },{})
// }

// function noteMap2pitchRange(){
//   return Object.entries(noteMap).sort((a,b)=>{
//     return a[0]-b[0]
//   }).reduce((prev,cur,index,arr)=>{
//     if(index == 0){
//       return [ Number(cur[0])]
//     } else if (index === arr.length-1){
//       return [...prev,Math.round((Number(cur[0])+Number(arr[index-1][0]))/2*100)/100,Number(cur[0])]
//     } else{
//       return [...prev,Math.round((Number(cur[0])+Number(arr[index-1][0]))/2*100)/100]
//     }
//   },[])
// }
const noteIndexMap = {
    1: 65.41,
    2: 69.3,
    3: 73.42,
    4: 77.78,
    5: 82.41,
    6: 87.31,
    7: 92.5,
    8: 98.0,
    9: 103.83,
    10: 110.0,
    11: 116.54,
    12: 123.47,
    13: 130.81,
    14: 138.59,
    15: 146.83,
    16: 155.56,
    17: 164.81,
    18: 174.61,
    19: 185.0,
    20: 196.0,
    21: 207.65,
    22: 220.0,
    23: 233.08,
    24: 246.94,
    25: 261.63,
    26: 277.18,
    27: 293.67,
    28: 311.12,
    29: 329.63,
    30: 349.23,
    31: 370.0,
    32: 392.0,
    33: 415.31,
    34: 440.0,
    35: 466.16,
    36: 493.89,
    37: 523.25,
    38: 554.37,
    39: 587.33,
    40: 622.25,
    41: 659.26,
    42: 698.46,
    43: 739.99,
    44: 783.99,
    45: 830.61,
    46: 880.0,
    47: 932.33,
    48: 987.77,
}
const pitchRange = [
    65.41, 67.35, 71.36, 75.6, 80.1, 84.86, 89.91, 95.25, 100.92, 106.92, 113.27, 120.01, 127.14, 134.7, 142.71, 151.2,
    160.19, 169.71, 179.81, 190.5, 201.83, 213.83, 226.54, 240.01, 254.29, 269.4, 285.43, 302.4, 320.38, 339.43, 359.62,
    381, 403.66, 427.66, 453.08, 480.03, 508.57, 538.81, 570.85, 604.79, 640.76, 678.86, 719.23, 761.99, 807.3, 855.31,
    906.17, 960.05, 987.77,
]

const GuitarNote = [
    [
        329.63, 349.23, 370, 392, 415.31, 440, 466.16, 493.89, 523.25, 554.37, 587.33, 622.25, 659.26, 698.46, 739.99,
        783.99, 830.61, 880, 932.33, 987.77,
    ],
    [
        246.94, 261.63, 277.18, 293.67, 311.12, 329.63, 349.23, 370, 392, 415.31, 440, 466.16, 493.89, 523.25, 554.37,
        587.33, 622.25, 659.26, 698.46, 739.99,
    ],
    [
        196, 207.65, 220, 233.08, 246.94, 261.63, 277.18, 293.67, 311.12, 329.63, 349.23, 370, 392.0, 415.31, 440,
        466.16, 493.89, 523.25, 554.37, 587.33,
    ],
    [
        146.83, 155.56, 164.81, 174.61, 185, 196, 207.65, 220, 233.08, 246.94, 261.63, 277.18, 293.67, 311.12, 329.63,
        349.23, 370, 392, 415.31, 440,
    ],
    [
        110, 116.54, 123.47, 130.81, 138.59, 146.83, 155.56, 164.81, 174.61, 185, 196, 207.65, 220.0, 233.08, 246.94,
        261.63, 277.18, 293.67, 311.12, 329.63,
    ],
    [
        82.41, 87.31, 92.5, 98, 103.83, 110, 116.54, 123.47, 130.81, 138.59, 146.83, 155.56, 164.81, 174.61, 185, 196,
        207.65, 220, 233.08, 246.94,
    ],
]

const GuitarNoteLocationMap = {
    [Symbol(82.41)]: [5, 0],
    [Symbol(87.31)]: [5, 1],
    [Symbol(92.5)]: [5, 2],
    [Symbol(98)]: [5, 3],
    [Symbol(103.83)]: [5, 4],
    [Symbol(110)]: [4, 0],
    [Symbol(110)]: [5, 5],
    [Symbol(116.54)]: [4, 1],
    [Symbol(116.54)]: [5, 6],
    [Symbol(123.47)]: [4, 2],
    [Symbol(123.47)]: [5, 7],
    [Symbol(130.81)]: [4, 3],
    [Symbol(130.81)]: [5, 8],
    [Symbol(138.59)]: [4, 4],
    [Symbol(138.59)]: [5, 9],
    [Symbol(146.83)]: [3, 0],
    [Symbol(146.83)]: [4, 5],
    [Symbol(146.83)]: [5, 10],
    [Symbol(155.56)]: [3, 1],
    [Symbol(155.56)]: [4, 6],
    [Symbol(155.56)]: [5, 11],
    [Symbol(164.81)]: [3, 2],
    [Symbol(164.81)]: [4, 7],
    [Symbol(164.81)]: [5, 12],
    [Symbol(174.61)]: [3, 3],
    [Symbol(174.61)]: [4, 8],
    [Symbol(174.61)]: [5, 13],
    [Symbol(185)]: [3, 4],
    [Symbol(185)]: [4, 9],
    [Symbol(185)]: [5, 14],
    [Symbol(196)]: [2, 0],
    [Symbol(196)]: [3, 5],
    [Symbol(196)]: [4, 10],
    [Symbol(196)]: [5, 15],
    [Symbol(207.65)]: [2, 1],
    [Symbol(207.65)]: [3, 6],
    [Symbol(207.65)]: [4, 11],
    [Symbol(207.65)]: [5, 16],
    [Symbol(220)]: [2, 2],
    [Symbol(220)]: [3, 7],
    [Symbol(220)]: [4, 12],
    [Symbol(220)]: [5, 17],
    [Symbol(233.08)]: [2, 3],
    [Symbol(233.08)]: [3, 8],
    [Symbol(233.08)]: [4, 13],
    [Symbol(233.08)]: [5, 18],
    [Symbol(246.94)]: [1, 0],
    [Symbol(246.94)]: [2, 4],
    [Symbol(246.94)]: [3, 9],
    [Symbol(246.94)]: [4, 14],
    [Symbol(246.94)]: [5, 19],
    [Symbol(261.63)]: [1, 1],
    [Symbol(261.63)]: [2, 5],
    [Symbol(261.63)]: [3, 10],
    [Symbol(261.63)]: [4, 15],
    [Symbol(277.18)]: [1, 2],
    [Symbol(277.18)]: [2, 6],
    [Symbol(277.18)]: [3, 11],
    [Symbol(277.18)]: [4, 16],
    [Symbol(293.67)]: [1, 3],
    [Symbol(293.67)]: [2, 7],
    [Symbol(293.67)]: [3, 12],
    [Symbol(293.67)]: [4, 17],
    [Symbol(311.12)]: [1, 4],
    [Symbol(311.12)]: [2, 8],
    [Symbol(311.12)]: [3, 13],
    [Symbol(311.12)]: [4, 18],
    [Symbol(329.63)]: [0, 0],
    [Symbol(329.63)]: [1, 5],
    [Symbol(329.63)]: [2, 9],
    [Symbol(329.63)]: [3, 14],
    [Symbol(329.63)]: [4, 19],
    [Symbol(349.23)]: [0, 1],
    [Symbol(349.23)]: [1, 6],
    [Symbol(349.23)]: [2, 10],
    [Symbol(349.23)]: [3, 15],
    [Symbol(370)]: [0, 2],
    [Symbol(370)]: [1, 7],
    [Symbol(370)]: [2, 11],
    [Symbol(370)]: [3, 16],
    [Symbol(392)]: [0, 3],
    [Symbol(392)]: [1, 8],
    [Symbol(392)]: [2, 12],
    [Symbol(392)]: [3, 17],
    [Symbol(415.31)]: [0, 4],
    [Symbol(415.31)]: [1, 9],
    [Symbol(415.31)]: [2, 13],
    [Symbol(415.31)]: [3, 18],
    [Symbol(440)]: [0, 5],
    [Symbol(440)]: [1, 10],
    [Symbol(440)]: [2, 14],
    [Symbol(440)]: [3, 19],
    [Symbol(466.16)]: [0, 6],
    [Symbol(466.16)]: [1, 11],
    [Symbol(466.16)]: [2, 15],
    [Symbol(493.89)]: [0, 7],
    [Symbol(493.89)]: [1, 12],
    [Symbol(493.89)]: [2, 16],
    [Symbol(523.25)]: [0, 8],
    [Symbol(523.25)]: [1, 13],
    [Symbol(523.25)]: [2, 17],
    [Symbol(554.37)]: [0, 9],
    [Symbol(554.37)]: [1, 14],
    [Symbol(554.37)]: [2, 18],
    [Symbol(587.33)]: [0, 10],
    [Symbol(587.33)]: [1, 15],
    [Symbol(587.33)]: [2, 19],
    [Symbol(622.25)]: [0, 11],
    [Symbol(622.25)]: [1, 16],
    [Symbol(659.26)]: [0, 12],
    [Symbol(659.26)]: [1, 17],
    [Symbol(698.46)]: [0, 13],
    [Symbol(698.46)]: [1, 18],
    [Symbol(739.99)]: [0, 14],
    [Symbol(739.99)]: [1, 19],
    [Symbol(783.99)]: [0, 15],
    [Symbol(830.61)]: [0, 16],
    [Symbol(880)]: [0, 17],
    [Symbol(932.33)]: [0, 18],
    [Symbol(987.77)]: [0, 19],
}

// function GuitarNote2LocationMap(){
//   return GuitarNote.reduce((OuterPrev,OuterCur,OuterIndex)=>{
//     return {
//       ...OuterPrev,
//       ...OuterCur.reduce((innerPrev,innerCur,innerIndex)=>{
//           return { ...innerPrev, [Symbol(innerCur)]:[OuterIndex,innerIndex] }
//       },{})
//     }
//   },{})
// }

function findNote(pitchs: number[], confidences: number[], duration: number) {
    const perTime = Math.round((duration / pitchs.length) * 100) / 100
    return pitchs.reduce((prev: any[], cur: number, index: number) => {
        let rangeIndex = pitchRange.findIndex(item => item >= cur) as keyof typeof noteIndexMap
        if ((rangeIndex as number) == -1 || (rangeIndex as number) == 0) {
            return prev
        }
        //合并相同音符
        if (prev.length > 0 && noteIndexMap[rangeIndex] == prev[prev.length - 1]?.pitch) {
            prev[prev.length - 1].duration += perTime
            return prev
        } else {
            return [
                ...prev,
                {
                    pitch: noteIndexMap[rangeIndex],
                    note: noteMap[noteIndexMap[rangeIndex] as keyof typeof noteMap],
                    duration: perTime,
                    confidence: confidences[index],
                    startTime: index * perTime,
                },
            ]
        }
    }, [])
}

interface spicePredictDataType {
    f0_hz: Array<number>
    loudness_db: Array<number>
    confidences: Array<number>
    originalRecordedBufferLength: string
    duration: number
}

export {findNote, noteMap, GuitarNote, GuitarNoteLocationMap, spicePredictDataType}
