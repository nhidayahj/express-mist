const {DiffuserCartItem} = require('../models/diffusers')
const cartDataLayer = require('../dal/cart')


class DiffuserCartServices {
    constructor(user_id){
        this.user_id = user_id;
    }

    async getAllDiffusers() {
        const allDiffusers = await cartDataLayer.getAllDiffusers(this.user_id)
        return allDiffusers;
    }

    async diffuserAddToCart(diffuserId) {
        // check if there is an existing diffuser in the shopping cart
        const diffuserCartItem = await cartDataLayer
            .getDiffuserByUserAndDiffuserId(this.user_id, diffuserId);

        if (!diffuserCartItem) {
            let newDiffuserItem = new DiffuserCartItem();
            newDiffuserItem.set('customer_id', this.user_id)
            newDiffuserItem.set('diffuser_id',diffuserId);
            newDiffuserItem.set('quantity',1);
            await newDiffuserItem.save();
            return newDiffuserItem;
        } else {
            diffuserCartItem.set('quantity', diffuserCartItem.get('quantity') + 1)
            await diffuserCartItem.save();
            return diffuserCartItem;
        }

    }

    async diffuserUpdateQuantity(diffuserId, newQuantity) {
        return await cartDataLayer.updateDiffuserQuantity(
            this.user_id, diffuserId, newQuantity);
        
    }

    async removeDiffuserItem(diffuserId){
        return await cartDataLayer.removeDiffuser(this.user_id,diffuserId);
    }
}

module.exports = DiffuserCartServices;