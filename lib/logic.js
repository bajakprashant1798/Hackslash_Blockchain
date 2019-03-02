/* global getAssetRegistry getFactory emit query */

/**
 * Redeem Ticket
 * @param {org.aiuto.app.redeemTicket} redeemTicket - the redeemTicket transaction
 * @transaction
 */
async function redeemTicket(redeemTicket) { // eslint-disable-line no-unused-vars
	
    var ticket = redeemTicket.ticket;
	if (ticket.state == 'AVAILABLE') {
		throw new Error('Oops! This ticket was not sold :( ');
	}
    else if (ticket.state == 'USED') {
		throw new Error('Oops! This ticket is already used :( ');
	}

	ticket.state = 'USED';

	return getAssetRegistry('org.aiuto.app.Ticket')
	.then(function (ticketRegistry) {
		return ticketRegistry.update(ticket);
	});
}


/**
 * Sell Ticket
 * @param {org.aiuto.app.sellTicket} sellTicket - the sellTicket transaction
 * @transaction
 */
async function sellTicket(sellTicket) { // eslint-disable-line no-unused-vars
	var NS = "org.aiuto.app";
	var factory = getFactory();
    var ticket = sellTicket.ticket;
	if (ticket.state != 'AVAILABLE') {
		throw new Error('Ticket already sold!');
    }			
	ticket.saleValue = ticket.faceValue;
    var aId = ticket.ticketId;
    var dnt = factory.newResource(NS, 'Donation', aId);
    dnt.amount = ticket.faceValue;
    
  ticket.state = 'SOLD';
	ticket.owner = sellTicket.user;
    
    /*return getAssetRegistry('org.aiuto.app.Ticket')
	   .then(function (ticketRegistry) {
		   return ticketRegistry.update(ticket);
	    });*/
  return getAssetRegistry('org.aiuto.app.Ticket')
	   .then(function (ticketRegistry) {
		   return ticketRegistry.update(ticket);
	    })
		.then(function() {return getAssetRegistry('org.aiuto.app.Donation')})
		   .then(function(donationRegistry) {
			   return donationRegistry.add(donation);
		   });
}

/**
 * Create Event
 * @param {org.aiuto.app.createEvent} createEvent - the createEvent transaction
 * @transaction
 */
function createEvent(createEvent) {
	
    var NS = "org.aiuto.app";
	var factory = getFactory();
    var event = factory.newResource(NS, 'Events', createEvent.eventId);
	event.date = createEvent.date;
	event.description = createEvent.description;
	event.venue = createEvent.venue;
	event.eventType = createEvent.eventType;
    event.quantity = createEvent.quantity;
    event.organizer = createEvent.organizer;
	
	var tickets = [];
	
    for (var i = 1; i <= event.quantity; i++) {
	   var ticket =  factory.newResource(NS, 'Ticket', i.toString());
	   ticket.seatId = ticket.ticketId;
	   ticket.baseValue = createEvent.ticketBaseValue;
	   ticket.state = 'AVAILABLE';
	   ticket.event = factory.newRelationship(NS, 'Events', event.eventId);
	   tickets.push(ticket);
    }
    return getAssetRegistry('org.aiuto.app')
	   .then(function (eventRegistry) {
		   return eventRegistry.add(event);
	    })
		.then(function() {return getAssetRegistry('org.aiuto.app')})
		   .then(function(ticketRegistry) {
			   return ticketRegistry.addAll(tickets);
		   });
}
