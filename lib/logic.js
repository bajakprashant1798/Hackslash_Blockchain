/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* global getAssetRegistry getFactory emit query */

/**
 * Track the trade of a commodity from one trader to another
 * @param {org.example.trading.Purchase} trade - the trade to be processed
 * @transaction
 */
async function purchaseTickets(purchase) { // eslint-disable-line no-unused-vars

    // set the new owner of the commodity
    purchase.tickets.owner = purchase.newOwner;
    const assetRegistry = await getAssetRegistry('org.example.trading.Tickets');

    // emit a notification that a trade has occurred
    const purchaseNotification = getFactory().newEvent('org.example.trading', 'PurchaseNotification');
    purchaseNotification.tickets = purchase.tickets;
    emit(purchaseNotification);

    // persist the state of the commodity
    await assetRegistry.update(purchase.tickets);
}

/**
 * Remove all high volume commodities
 * @param {org.example.trading.RemoveHighQuantityCommodities} remove - the remove to be processed
 * @transaction
 */
async function removeHighQuantityCommodities(remove) { // eslint-disable-line no-unused-vars

    const assetRegistry = await getAssetRegistry('org.example.trading.Tickets');
    const results = await query('selectCommoditiesWithHighQuantity');

    // since all registry requests have to be serialized anyway, there is no benefit to calling Promise.all
    // on an array of promises
    results.forEach(async purchase => {
        const removeNotification = getFactory().newEvent('org.example.trading', 'RemoveNotification');
        removeNotification.tickets = purchase;
        emit(removeNotification);
        await assetRegistry.remove(purchase);
    });
}
