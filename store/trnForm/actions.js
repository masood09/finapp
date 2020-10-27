import dayjs from 'dayjs'

export default {
  closeTrnForm ({ commit }) {
    commit('closeTrnForm')
    commit('setTrnFormValues', {
      trnId: null,
      amountEvaluation: null
    })
  },

  openTrnForm ({ rootState, rootGetters, commit }, { action, trnId }) {
    commit('openTrnForm')
    switch (action) {
      case 'create':
        // Load last trn
        if (rootGetters['trns/hasTrns'] && rootState.trns.items[rootGetters['trns/lastCreatedTrnId']]) {
          const lastTrn = rootState.trns.items[rootGetters['trns/lastCreatedTrnId']]
          commit('setTrnFormValues', {
            amount: '0',
            amountEvaluation: null,
            amountType: 0,
            categoryId: lastTrn.categoryId,
            date: dayjs().valueOf(),
            description: null,
            trnId: null,
            walletId: lastTrn.walletId
          })
        }
        // Fill data from first wallet and category
        else {
          const categoriesIds = Object.keys(rootState.categories.items)
          const categoryId = categoriesIds[0]
          const walletsIds = Object.keys(rootState.wallets.items)
          const walletId = walletsIds[0]
          commit('setTrnFormValues', {
            amount: '0',
            amountEvaluation: null,
            amountType: 0,
            categoryId,
            date: dayjs().valueOf(),
            description: null,
            trnId: null,
            walletId
          })
        }
        break

      case 'edit':
        if (trnId && rootGetters['trns/hasTrns']) {
          const trn = rootState.trns.items[trnId]

          // Incomes || Expenses
          if (trn.type !== 2) {
            commit('setTrnFormValues', {
              ...trn,
              amount: trn.amount,
              amountEvaluation: null,
              amountType: trn.type,
              categoryId: trn.categoryId,
              date: trn.date,
              description: trn.description || null,
              trnId,
              walletId: trn.walletId
            })
          }
          // Trnasfer
          else {
            console.log(trn)
            commit('setTrnFormValues', {
              ...trn,
              amount: trn.fromAmount,
              amountEvaluation: trn.fromAmount,
              amountType: trn.type,
              date: trn.date,
              description: trn.description || null,
              trnId
            })

            commit('setTrnFormTransfer', {
              tranferType: 'from',
              walletId: trn.fromWalletId
            })
            commit('setTrnFormTransfer', {
              tranferType: 'to',
              walletId: trn.toWalletId
            })
          }
        }
        break

      case 'duplicate':
        if (trnId && rootGetters['trns/hasTrns']) {
          const trn = rootState.trns.items[trnId]
          commit('setTrnFormValues', {
            ...trn,
            amountEvaluation: null,
            amountType: trn.type,
            categoryId: trn.categoryId,
            date: dayjs().valueOf(),
            description: trn.description || null,
            trnId: null,
            walletId: trn.walletId
          })
        }
        break
    }
  }
}
