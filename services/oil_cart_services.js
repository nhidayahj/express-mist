const {OilCartItem} = require('../models/diffusers');
const cartDataLayer = require('../dal/cart')

class OilCartServices {
    constructor(user_id) {
        this.user_id = user_id;
    }

    async getAllOils() {
        const allOils = await cartDataLayer.getAllOils(this.user_id);
        return allOils;
    }

    async addOilToCart(oilId) {
        const oilCartItem = await cartDataLayer.getOilByUserAndOilId(this.user_id, oilId);
        if (!oilCartItem) {
            let newOil = new OilCartItem();
            newOil.set('customer_id', this.user_id);
            newOil.set('oil_id', oilId);
            newOil.set('quantity', 1);
            await newOil.save();
            return newOil;
        } else {
            oilCartItem.set('quantity', oilCartItem.get('quantity') + 1);
            await oilCartItem.save();
            return oilCartItem;
        }
    }

    async oilUpdateQuantity(oilId, newQuantity) {
        return await cartDataLayer.updateOilQuantity(
            this.user_id, oilId, newQuantity);
        
    }

    async removeOil(oilId){
        return await cartDataLayer.removeOil(this.user_id,oilId);
    }
}

module.exports = OilCartServices;