# Hackslash_Blockchain

## Problem Statement:

To develop a platform which collaborates event organizers and charitable trusts or NGOs with end users who pay through blockchain tokens for different events on the platform and a part is contributed to the trusts or NGOs.

## Description:

Many NGOs struggle to collect or raise funds for their trusts. This platform will register
and collect important data on partner NGOs and will be shown to various event organizers. The
event organizer who selects our platform to sell his product will select such NGOs as partners
who then will be contributed certain amount when a user of the platform buys any
product(tickets or passes) from our platform by blockchain tokens. We have to take crucial steps
to provide transparency with the contributions so that the user knows where is funds are
allocated.


> This Business Network illustrates Event Ticketing for Social Good.

This business network defines:

**Actors**

`User`
- `Organizer`
- `Visitors`

`NGOs`

**Asset**
`Tickets`

**Transaction(s)**
`Purchase`

**Event**
`PurchaseNotification `

To test this Business Network Definition in the **Test** tab:

Create two `User` participants:

```

{
  "$class": "org.example.trading.User",
  "userId": "1124",
  "firstName": "Umang",
  "lastName": "Patel",
  "email": "umang@google.com",
  "Company": "Google",
  "isOrganizer": 1
}
```

```
{
  "$class": "org.example.trading.User",
  "userId": "7226",
  "firstName": "Ayush",
  "lastName": "Panara",
  "email": "ayush@panara.com",
  "Company": "AHDUNI",
  "isOrganizer": 0
}

```

Create a `Ticket` asset:

```
{
  "$class": "org.example.trading.Tickets",
  "tradingSymbol": "4226",
  "description": "Sample Ticket",
  "mainExchange": "",
  "quantity": 10,
  "owner": "resource:org.example.trading.User#1124"
}
```

Submit a `Purchase` transaction:

```
{
  "$class": "org.example.trading.Purchase",
  "commodity": "resource:org.example.trading.Tickets#ABC",
  "newOwner": "resource:org.example.trading.User#Visitor"
}
```

After submitting this transaction, you should now see the transaction in the transaction registry. As a result, the owner of the Ticket `ABC` should now be owned by `Visitor` in the Asset Registry.


## License <a name="license"></a>
Hyperledger Project source code files are made available under the Apache License, Version 2.0 (Apache-2.0), located in the LICENSE file. Hyperledger Project documentation files are made available under the Creative Commons Attribution 4.0 International License (CC-BY-4.0), available at http://creativecommons.org/licenses/by/4.0/.
