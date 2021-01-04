app = new Vue({
    el: '#app',
    data: {
        height: 30,
        width: 50,
        state: null,
        interval: null,

        tickint: 300,
        ticks: 0,
    },
    created() {
        this.initial()
    },
    methods: {
        initial() {
            this.reset()

            // Initial config
            let aliveCells = [
                [this.height / 2, this.width / 2],
                [this.height / 2, this.width / 2 - 1],
                [this.height / 2, this.width / 2 + 1],
                [this.height / 2 - 1, this.width / 2 + 1],
                [this.height / 2 - 2, this.width / 2],
            ]
            
            for (let i = 0; i < aliveCells.length; i++) {
                this.state[aliveCells[i][0]][aliveCells[i][1]] = true
            }
        },
        toggle(i, j) {
            const r = this.state[i].slice(0)
            r[j] = !r[j]
            this.$set(this.state, i, r)
        },
        corner(i, j) {
            if (i == 0 && j == 0) return 1
            if (i == 0 && j == (this.width - 1)) return 2
            if (i == (this.height - 1) && j == (this.width - 1)) return 3
            if (i == (this.height - 1) && j == 0) return 4
    
            return 0
        },
        edge(i, j) {
            if (i == 0) return 1
            if (j == this.width - 1) return 2
            if (i == this.height - 1) return 3
            if (j == 0) return 4
    
            return 0
        },
        numNeighboursAlive(i, j) {
            const corner = this.corner(i, j)
            const edge = this.edge(i, j)
    
            let nIndices = []
            if (corner) {
                lastCornerI = this.height - 1
                lastCornerJ = this.width - 1
                switch (corner) {
                    case 1:
                        nIndices = [
                            [0, 1],
                            [1, 0],
                            [1, 1]
                        ]
                        break
                    case 2:
                        nIndices = [
                            [0, lastCornerJ - 1],
                            [1, lastCornerJ - 1],
                            [1, lastCornerJ]
                        ]
                        break
                    case 3:
                        nIndices = [
                            [lastCornerI - 1, lastCornerJ - 1],
                            [lastCornerI - 1, lastCornerJ],
                            [lastCornerI, lastCornerJ - 1]
                        ]
                        break
                    case 4:
                        nIndices = [
                            [lastCornerI - 1, lastCornerJ - 1],
                            [lastCornerI - 1, lastCornerJ],
                            [lastCornerI, lastCornerJ - 1]
                        ]
                        break
                }
            } else if (edge) {
                switch (edge) {
                    case 1:
                        nIndices = [
                            [0, j - 1],
                            [0, j + 1],
                            [1, j - 1],
                            [1, j],
                            [1, j + 1],
                        ]
                        break
                    case 2:
                        nIndices = [
                            [i - 1, j - 1],
                            [i,     j - 1],
                            [i + 1, j - 1],
                            [i - 1, j],
                            [i + 1, j],
                        ]
                        break
                    case 3:
                        nIndices = [
                            [i - 1, j - 1],
                            [i - 1, j    ],
                            [i - 1, j + 1],
                            [i,     j - 1],
                            [i,     j + 1],
                        ]
                        break
                    case 4:
                        nIndices = [
                            [i - 1, j],
                            [i + 1, j],
                            [i - 1, j + 1],
                            [i,     j + 1],
                            [i + 1, j + 1],
                        ]
                        break
                }
            } else {
                nIndices = [ 
                    [i-1, j-1],
                    [i-1, j  ],
                    [i-1, j+1],
                    [i,   j-1],
                    [i,   j+1],
                    [i+1, j-1],
                    [i+1, j  ],
                    [i+1, j+1],
                ]
            }
    
            let nAlive = 0
            for (let i = 0; i < nIndices.length; i++) {
                if (this.state[nIndices[i][0]][nIndices[i][1]]) {
                    nAlive++
                }
            }
    
            return nAlive
        },
        tick() {
            let newState = []
            for (let i = 0; i < this.height; i++) {
                newState[i] = []
                for (let j = 0; j < this.width; j++) {
                    const nA = this.numNeighboursAlive(i, j)
                    if (this.state[i][j] && (nA < 2 || nA > 3)) {
                        newState[i][j] = false
                    } else if (!this.state[i][j] && nA == 3) {
                        newState[i][j] = true
                    } else {
                        newState[i][j] = this.state[i][j]
                    }
                }
            }
    
            Vue.set(this, 'state', newState)

            this.ticks++
        },
        auto() {
            if (!this.interval) {
                this.interval = setInterval(() => { this.tick() }, this.tickint)
            } else {
                clearInterval(this.interval)
                this.interval = null
            }
        },
        reset() {
            if (this.interval) {
                clearInterval(this.interval)
                this.interval = null
            }

            this.ticks = 0
            let newState = []
            for (let i = 0; i < this.height; i++) {
                newState[i] = []
                for (let j = 0; j < this.width; j++) {
                    newState[i][j] = false
                }
            }

            Vue.set(this, 'state', newState)
        },
    }
})