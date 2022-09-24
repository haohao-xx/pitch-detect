/** @format */

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

//二分找到所有符合的音高，会有多个
function binarySearch(arr, left, right, pitch) {
    if (left > right) {
        return []
    }
    const mid = Math.round((left + right) / 2)

    if (arr[mid].description > pitch) {
        return binarySearch(arr, left, mid - 1, pitch)
    } else if (arr[mid].description < pitch) {
        return binarySearch(arr, mid + 1, right, pitch)
    } else {
        const result = []
        let index = mid - 1
        while (index >= 0 && arr[index].description == pitch) {
            result.push(arr[index])
            index--
        }
        result.push(arr[mid])

        index = mid + 1
        while (index < arr.length && arr[index].description == pitch) {
            result.push(arr[index])
            index++
        }

        return result
    }
}

function distance(A, B) {
    return Math.round(Math.sqrt((A[0] - B[0]) ** 2 + (A[1] - B[1]) ** 2) * 100) / 100
}

function findMinLocation(locationArr, referenceLocation) {
    return locationArr.reduce((prev, cur) => {
        if (!prev) {
            return GuitarNoteLocationMap[cur]
        } else {
            return distance(referenceLocation, GuitarNoteLocationMap[cur]) < distance(referenceLocation, prev)
                ? GuitarNoteLocationMap[cur]
                : prev
        }
    }, '')
}

function process(pitchArr, rawData) {
    const symbolArr = Object.getOwnPropertySymbols(GuitarNoteLocationMap)
    //对每一个可能的开头位置进行搜索
    const heads = binarySearch(symbolArr, 0, symbolArr.length - 1, pitchArr[0])
    let res = []
    for (let i = 0; i < heads.length; i++) {
        const temporary = pitchArr.reduce(
            (prev, cur, index, arr) => {
                if (index == 0) return prev
                const availableNote = binarySearch(symbolArr, 0, symbolArr.length - 1, cur)
                const minLocation = findMinLocation(availableNote, prev.location[index - 1])
                prev.weights += distance(minLocation, prev.location[index - 1])
                prev.location.push(minLocation)
                return prev
            },
            {weights: 0, location: [GuitarNoteLocationMap[heads[i]]]},
        )
        res.push({
            weights: temporary.weights,
            result: temporary.location.map((item, index) => {
                return {...rawData[index], location: item} //这里之前用 object.assign(rawData[index],{location;item}),会出现地址相同的情况
            }),
        })
    }
    return res
}

self.onmessage = function (e) {
    let rawData = e.data
    if (!rawData.length) {
        self.postMessage('ok')
        return
    }
    const pitchArr = rawData.map(item => item.pitch)
    const locationArr = process(pitchArr, rawData)
    self.postMessage(locationArr)
}
