module.exports.login = function () {
    return {
        "Contact information": {
            "Name": "Ollie",
            "Mailing Address": "1990 Dunbar Street\\nApartment 201\\nVancouver, British Columbia\\nV6R 3M3",
            "Phone": 6044016325,
            "Email": "ojapringle@gmail.com"
        },
        "Communication Preferences": {
            "Email Notifications": false
        },
        "Payment methods": [
            {
                "Name on card": "Oliver Pringle",
                "Expiry date": "2021-10-01T00:00:00.000Z",
                "First name": "Olivander",
                "Last name": "Prangler",
                "Address Line 1": "500 Magical Lane",
                "Address Line 2": "Apartment 5000",
                "City": "Vancouver",
                "Postal Code": "V6Z 3H3",
                "Province": "BC",
                "Phone": 6044016325,
                "Primary": true,
                "Autoload": false
            },
            {
                "Name on card": "Jane Pringle",
                "Expiry date": "2021-10-01T00:00:00.000Z",
                "First name": "Olivander",
                "Last name": "Prangler",
                "Address Line 1": "500 Magical Lane",
                "Address Line 2": "Apartment 5000",
                "City": "Vancouver",
                "Postal Code": "V6Z 3H3",
                "Province": "BC",
                "Phone": 6044016325,
                "Primary": false,
                "Autoload": false
            },  
        ],
        "Cards": ["Oliver Pringle", "Jane Pringle", "Alice Pringle"]
    };
}