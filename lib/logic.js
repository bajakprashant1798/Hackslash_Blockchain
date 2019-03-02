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
function sellTicket(sellTicket) { // eslint-disable-line no-unused-vars
	var NS = "org.aiuto.app";
	var factory = getFactory();
    var ticket = sellTicket.ticket;
	if (ticket.state != 'AVAILABLE') {
		throw new Error('Ticket already sold!');
    }			
	ticket.saleValue = ticket.baseValue;
    var aId = ticket.ticketId;
    //var amount = ticket.saleValue;
    var dnt = factory.newResource(NS, 'Donation', aId);
    dnt.amount = ticket.baseValue * ticket.events.donatePer/100 ;
    ticket.state = 'SOLD';
	ticket.owner = sellTicket.user;
    ticket.donation = dnt;
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
			   return donationRegistry.add(dnt);
		   });
}

function donation(amount) { // eslint-disable-line no-unused-vars
	var NS = "org.aiuto.app";
	var factory = getFactory();
    var dnt = factory.newResource(NS, 'Donation', 'DONATE');
    dnt.amount = amount;
  	dnt.donationId = 1;
}

/**
 * Create Event
 * @param {org.aiuto.app.createEvent} createEvent - the createEvent transaction
 * @transaction
 */
function createEvent(createEvent) {
	
    var NS = "org.aiuto.app";
	var factory = getFactory();
    var events = factory.newResource(NS, 'Events', createEvent.eventId);
	events.date = createEvent.date;
	events.description = createEvent.description;
	events.venue = createEvent.venue;
	events.eventType = createEvent.eventType;
    events.quantity = createEvent.quantity;
    events.organizer = createEvent.organizer;
    events.ngo = createEvent.ngo;
	events.donatePer = createEvent.donatePer;
	var tickets = [];
	
    for (var i = 1; i <= events.quantity; i++) {
	   var ticket =  factory.newResource(NS, 'Ticket', (new Date).getTime()+i.toString());
	   ticket.seatId = ticket.ticketId;
	   ticket.baseValue = createEvent.ticketBaseValue;
	   ticket.state = 'AVAILABLE';
	   ticket.events = factory.newRelationship(NS, 'Events', events.eventId);
	   tickets.push(ticket);
    }
    return getAssetRegistry('org.aiuto.app.Events')
	   .then(function (eventRegistry) {
		   return eventRegistry.add(events);
	    })
		.then(function() {return getAssetRegistry('org.aiuto.app.Ticket')})
		   .then(function(ticketRegistry) {
			   return ticketRegistry.addAll(tickets);
		   });
}
