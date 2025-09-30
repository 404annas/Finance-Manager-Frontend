const currencies = [
    {
        "code": "AED",
        "name": "UAE Dirham",
        "country": "United Arab Emirates",
        "countryCode": "AE",
        "flag": "https://flagsapi.com/AE/flat/64.png"
    },
    {
        "code": "AFN",
        "name": "Afghan Afghani",
        "country": "Afghanistan",
        "countryCode": "AF",
        "flag": "https://flagsapi.com/AF/flat/64.png"
    },
    {
        "code": "ALL",
        "name": "Albanian Lek",
        "country": "Albania",
        "countryCode": "AL",
        "flag": "https://flagsapi.com/AL/flat/64.png"
    },
    {
        "code": "AMD",
        "name": "Armenian Dram",
        "country": "Armenia",
        "countryCode": "AM",
        "flag": "https://flagsapi.com/AM/flat/64.png"
    },
    {
        "code": "ANG",
        "name": "Netherlands Antillian Guilder",
        "country": "Netherlands Antilles",
        "countryCode": "AN",
        "flag": "https://flagsapi.com/AN/flat/64.png"
    },
    {
        "code": "AOA",
        "name": "Angolan Kwanza",
        "country": "Angola",
        "countryCode": "AO",
        "flag": "https://flagsapi.com/AO/flat/64.png"
    },
    {
        "code": "ARS",
        "name": "Argentine Peso",
        "country": "Argentina",
        "countryCode": "AR",
        "flag": "https://flagsapi.com/AR/flat/64.png"
    },
    {
        "code": "AUD",
        "name": "Australian Dollar",
        "country": "Australia",
        "countryCode": "AU",
        "flag": "https://flagsapi.com/AU/flat/64.png"
    },
    {
        "code": "AWG",
        "name": "Aruban Florin",
        "country": "Aruba",
        "countryCode": "AW",
        "flag": "https://flagsapi.com/AW/flat/64.png"
    },
    {
        "code": "AZN",
        "name": "Azerbaijani Manat",
        "country": "Azerbaijan",
        "countryCode": "AZ",
        "flag": "https://flagsapi.com/AZ/flat/64.png"
    },
    {
        "code": "BAM",
        "name": "Bosnia and Herzegovina Mark",
        "country": "Bosnia and Herzegovina",
        "countryCode": "BA",
        "flag": "https://flagsapi.com/BA/flat/64.png"
    },
    {
        "code": "BBD",
        "name": "Barbados Dollar",
        "country": "Barbados",
        "countryCode": "BB",
        "flag": "https://flagsapi.com/BB/flat/64.png"
    },
    {
        "code": "BDT",
        "name": "Bangladeshi Taka",
        "country": "Bangladesh",
        "countryCode": "BD",
        "flag": "https://flagsapi.com/BD/flat/64.png"
    },
    {
        "code": "BGN",
        "name": "Bulgarian Lev",
        "country": "Bulgaria",
        "countryCode": "BG",
        "flag": "https://flagsapi.com/BG/flat/64.png"
    },
    {
        "code": "BHD",
        "name": "Bahraini Dinar",
        "country": "Bahrain",
        "countryCode": "BH",
        "flag": "https://flagsapi.com/BH/flat/64.png"
    },
    {
        "code": "BIF",
        "name": "Burundian Franc",
        "country": "Burundi",
        "countryCode": "BI",
        "flag": "https://flagsapi.com/BI/flat/64.png"
    },
    {
        "code": "BMD",
        "name": "Bermudian Dollar",
        "country": "Bermuda",
        "countryCode": "BM",
        "flag": "https://flagsapi.com/BM/flat/64.png"
    },
    {
        "code": "BND",
        "name": "Brunei Dollar",
        "country": "Brunei Darussalam",
        "countryCode": "BN",
        "flag": "https://flagsapi.com/BN/flat/64.png"
    },
    {
        "code": "BOB",
        "name": "Bolivian Boliviano",
        "country": "Bolivia",
        "countryCode": "BO",
        "flag": "https://flagsapi.com/BO/flat/64.png"
    },
    {
        "code": "BRL",
        "name": "Brazilian Real",
        "country": "Brazil",
        "countryCode": "BR",
        "flag": "https://flagsapi.com/BR/flat/64.png"
    },
    {
        "code": "BSD",
        "name": "Bahamian Dollar",
        "country": "Bahamas",
        "countryCode": "BS",
        "flag": "https://flagsapi.com/BS/flat/64.png"
    },
    {
        "code": "BTN",
        "name": "Bhutanese Ngultrum",
        "country": "Bhutan",
        "countryCode": "BT",
        "flag": "https://flagsapi.com/BT/flat/64.png"
    },
    {
        "code": "BWP",
        "name": "Botswana Pula",
        "country": "Botswana",
        "countryCode": "BW",
        "flag": "https://flagsapi.com/BW/flat/64.png"
    },
    {
        "code": "BYN",
        "name": "Belarusian Ruble",
        "country": "Belarus",
        "countryCode": "BY",
        "flag": "https://flagsapi.com/BY/flat/64.png"
    },
    {
        "code": "BZD",
        "name": "Belize Dollar",
        "country": "Belize",
        "countryCode": "BZ",
        "flag": "https://flagsapi.com/BZ/flat/64.png"
    },
    {
        "code": "CAD",
        "name": "Canadian Dollar",
        "country": "Canada",
        "countryCode": "CA",
        "flag": "https://flagsapi.com/CA/flat/64.png"
    },
    {
        "code": "CDF",
        "name": "Congolese Franc",
        "country": "Democratic Republic of the Congo",
        "countryCode": "CD",
        "flag": "https://flagsapi.com/CD/flat/64.png"
    },
    {
        "code": "CHF",
        "name": "Swiss Franc",
        "country": "Switzerland",
        "countryCode": "CH",
        "flag": "https://flagsapi.com/CH/flat/64.png"
    },
    {
        "code": "CLP",
        "name": "Chilean Peso",
        "country": "Chile",
        "countryCode": "CL",
        "flag": "https://flagsapi.com/CL/flat/64.png"
    },
    {
        "code": "CNY",
        "name": "Chinese Renminbi",
        "country": "China",
        "countryCode": "CN",
        "flag": "https://flagsapi.com/CN/flat/64.png"
    },
    {
        "code": "COP",
        "name": "Colombian Peso",
        "country": "Colombia",
        "countryCode": "CO",
        "flag": "https://flagsapi.com/CO/flat/64.png"
    },
    {
        "code": "CRC",
        "name": "Costa Rican Colon",
        "country": "Costa Rica",
        "countryCode": "CR",
        "flag": "https://flagsapi.com/CR/flat/64.png"
    },
    {
        "code": "CUP",
        "name": "Cuban Peso",
        "country": "Cuba",
        "countryCode": "CU",
        "flag": "https://flagsapi.com/CU/flat/64.png"
    },
    {
        "code": "CVE",
        "name": "Cape Verdean Escudo",
        "country": "Cape Verde",
        "countryCode": "CV",
        "flag": "https://flagsapi.com/CV/flat/64.png"
    },
    {
        "code": "CZK",
        "name": "Czech Koruna",
        "country": "Czech Republic",
        "countryCode": "CZ",
        "flag": "https://flagsapi.com/CZ/flat/64.png"
    },
    {
        "code": "DJF",
        "name": "Djiboutian Franc",
        "country": "Djibouti",
        "countryCode": "DJ",
        "flag": "https://flagsapi.com/DJ/flat/64.png"
    },
    {
        "code": "DKK",
        "name": "Danish Krone",
        "country": "Denmark",
        "countryCode": "DK",
        "flag": "https://flagsapi.com/DK/flat/64.png"
    },
    {
        "code": "DOP",
        "name": "Dominican Peso",
        "country": "Dominican Republic",
        "countryCode": "DO",
        "flag": "https://flagsapi.com/DO/flat/64.png"
    },
    {
        "code": "DZD",
        "name": "Algerian Dinar",
        "country": "Algeria",
        "countryCode": "DZ",
        "flag": "https://flagsapi.com/DZ/flat/64.png"
    },
    {
        "code": "EGP",
        "name": "Egyptian Pound",
        "country": "Egypt",
        "countryCode": "EG",
        "flag": "https://flagsapi.com/EG/flat/64.png"
    },
    {
        "code": "ERN",
        "name": "Eritrean Nakfa",
        "country": "Eritrea",
        "countryCode": "ER",
        "flag": "https://flagsapi.com/ER/flat/64.png"
    },
    {
        "code": "ETB",
        "name": "Ethiopian Birr",
        "country": "Ethiopia",
        "countryCode": "ET",
        "flag": "https://flagsapi.com/ET/flat/64.png"
    },
    {
        "code": "EUR",
        "name": "Euro",
        "country": "European Union",
        "countryCode": "eu",
        "flag": "https://flagsapi.com/EU/flat/64.png"
    },
    {
        "code": "FJD",
        "name": "Fiji Dollar",
        "country": "Fiji",
        "countryCode": "FJ",
        "flag": "https://flagsapi.com/FJ/flat/64.png"
    },
    {
        "code": "FKP",
        "name": "Falkland Islands Pound",
        "country": "Falkland Islands",
        "countryCode": "FK",
        "flag": "https://flagsapi.com/FK/flat/64.png"
    },
    {
        "code": "FOK",
        "name": "Faroese Króna",
        "country": "Faroe Islands",
        "countryCode": "FO",
        "flag": "https://flagsapi.com/FO/flat/64.png"
    },
    {
        "code": "GBP",
        "name": "Pound Sterling",
        "country": "United Kingdom",
        "countryCode": "GB",
        "flag": "https://flagsapi.com/GB/flat/64.png"
    },
    {
        "code": "GEL",
        "name": "Georgian Lari",
        "country": "Georgia",
        "countryCode": "GE",
        "flag": "https://flagsapi.com/GE/flat/64.png"
    },
    {
        "code": "GGP",
        "name": "Guernsey Pound",
        "country": "Guernsey",
        "countryCode": "GG",
        "flag": "https://flagsapi.com/GG/flat/64.png"
    },
    {
        "code": "GHS",
        "name": "Ghanaian Cedi",
        "country": "Ghana",
        "countryCode": "GH",
        "flag": "https://flagsapi.com/GH/flat/64.png"
    },
    {
        "code": "GIP",
        "name": "Gibraltar Pound",
        "country": "Gibraltar",
        "countryCode": "GI",
        "flag": "https://flagsapi.com/GI/flat/64.png"
    },
    {
        "code": "GMD",
        "name": "Gambian Dalasi",
        "country": "The Gambia",
        "countryCode": "GM",
        "flag": "https://flagsapi.com/GM/flat/64.png"
    },
    {
        "code": "GNF",
        "name": "Guinean Franc",
        "country": "Guinea",
        "countryCode": "GN",
        "flag": "https://flagsapi.com/GN/flat/64.png"
    },
    {
        "code": "GTQ",
        "name": "Guatemalan Quetzal",
        "country": "Guatemala",
        "countryCode": "GT",
        "flag": "https://flagsapi.com/GT/flat/64.png"
    },
    {
        "code": "GYD",
        "name": "Guyanese Dollar",
        "country": "Guyana",
        "countryCode": "GY",
        "flag": "https://flagsapi.com/GY/flat/64.png"
    },
    {
        "code": "HKD",
        "name": "Hong Kong Dollar",
        "country": "Hong Kong",
        "countryCode": "HK",
        "flag": "https://flagsapi.com/HK/flat/64.png"
    },
    {
        "code": "HNL",
        "name": "Honduran Lempira",
        "country": "Honduras",
        "countryCode": "HN",
        "flag": "https://flagsapi.com/HN/flat/64.png"
    },
    {
        "code": "HRK",
        "name": "Croatian Kuna",
        "country": "Croatia",
        "countryCode": "HR",
        "flag": "https://flagsapi.com/HR/flat/64.png"
    },
    {
        "code": "HTG",
        "name": "Haitian Gourde",
        "country": "Haiti",
        "countryCode": "HT",
        "flag": "https://flagsapi.com/HT/flat/64.png"
    },
    {
        "code": "HUF",
        "name": "Hungarian Forint",
        "country": "Hungary",
        "countryCode": "HU",
        "flag": "https://flagsapi.com/HU/flat/64.png"
    },
    {
        "code": "IDR",
        "name": "Indonesian Rupiah",
        "country": "Indonesia",
        "countryCode": "ID",
        "flag": "https://flagsapi.com/ID/flat/64.png"
    },
    {
        "code": "ILS",
        "name": "Israeli New Shekel",
        "country": "Israel",
        "countryCode": "IL",
        "flag": "https://flagsapi.com/IL/flat/64.png"
    },
    {
        "code": "IMP",
        "name": "Manx Pound",
        "country": "Isle of Man",
        "countryCode": "IM",
        "flag": "https://flagsapi.com/IM/flat/64.png"
    },
    {
        "code": "INR",
        "name": "Indian Rupee",
        "country": "India",
        "countryCode": "IN",
        "flag": "https://flagsapi.com/IN/flat/64.png"
    },
    {
        "code": "IQD",
        "name": "Iraqi Dinar",
        "country": "Iraq",
        "countryCode": "IQ",
        "flag": "https://flagsapi.com/IQ/flat/64.png"
    },
    {
        "code": "IRR",
        "name": "Iranian Rial",
        "country": "Iran",
        "countryCode": "IR",
        "flag": "https://flagsapi.com/IR/flat/64.png"
    },
    {
        "code": "ISK",
        "name": "Icelandic Króna",
        "country": "Iceland",
        "countryCode": "IS",
        "flag": "https://flagsapi.com/IS/flat/64.png"
    },
    {
        "code": "JEP",
        "name": "Jersey Pound",
        "country": "Jersey",
        "countryCode": "JE",
        "flag": "https://flagsapi.com/JE/flat/64.png"
    },
    {
        "code": "JMD",
        "name": "Jamaican Dollar",
        "country": "Jamaica",
        "countryCode": "JM",
        "flag": "https://flagsapi.com/JM/flat/64.png"
    },
    {
        "code": "JOD",
        "name": "Jordanian Dinar",
        "country": "Jordan",
        "countryCode": "JO",
        "flag": "https://flagsapi.com/JO/flat/64.png"
    },
    {
        "code": "JPY",
        "name": "Japanese Yen",
        "country": "Japan",
        "countryCode": "JP",
        "flag": "https://flagsapi.com/JP/flat/64.png"
    },
    {
        "code": "KES",
        "name": "Kenyan Shilling",
        "country": "Kenya",
        "countryCode": "KE",
        "flag": "https://flagsapi.com/KE/flat/64.png"
    },
    {
        "code": "KGS",
        "name": "Kyrgyzstani Som",
        "country": "Kyrgyzstan",
        "countryCode": "KG",
        "flag": "https://flagsapi.com/KG/flat/64.png"
    },
    {
        "code": "KHR",
        "name": "Cambodian Riel",
        "country": "Cambodia",
        "countryCode": "KH",
        "flag": "https://flagsapi.com/KH/flat/64.png"
    },
    {
        "code": "KID",
        "name": "Kiribati Dollar",
        "country": "Kiribati",
        "countryCode": "KI",
        "flag": "https://flagsapi.com/KI/flat/64.png"
    },
    {
        "code": "KMF",
        "name": "Comorian Franc",
        "country": "Comoros",
        "countryCode": "KM",
        "flag": "https://flagsapi.com/KM/flat/64.png"
    },
    {
        "code": "KRW",
        "name": "South Korean Won",
        "country": "South Korea",
        "countryCode": "KR",
        "flag": "https://flagsapi.com/KR/flat/64.png"
    },
    {
        "code": "KWD",
        "name": "Kuwaiti Dinar",
        "country": "Kuwait",
        "countryCode": "KW",
        "flag": "https://flagsapi.com/KW/flat/64.png"
    },
    {
        "code": "KYD",
        "name": "Cayman Islands Dollar",
        "country": "Cayman Islands",
        "countryCode": "KY",
        "flag": "https://flagsapi.com/KY/flat/64.png"
    },
    {
        "code": "KZT",
        "name": "Kazakhstani Tenge",
        "country": "Kazakhstan",
        "countryCode": "KZ",
        "flag": "https://flagsapi.com/KZ/flat/64.png"
    },
    {
        "code": "LAK",
        "name": "Lao Kip",
        "country": "Laos",
        "countryCode": "LA",
        "flag": "https://flagsapi.com/LA/flat/64.png"
    },
    {
        "code": "LBP",
        "name": "Lebanese Pound",
        "country": "Lebanon",
        "countryCode": "LB",
        "flag": "https://flagsapi.com/LB/flat/64.png"
    },
    {
        "code": "LKR",
        "name": "Sri Lanka Rupee",
        "country": "Sri Lanka",
        "countryCode": "LK",
        "flag": "https://flagsapi.com/LK/flat/64.png"
    },
    {
        "code": "LRD",
        "name": "Liberian Dollar",
        "country": "Liberia",
        "countryCode": "LR",
        "flag": "https://flagsapi.com/LR/flat/64.png"
    },
    {
        "code": "LSL",
        "name": "Lesotho Loti",
        "country": "Lesotho",
        "countryCode": "LS",
        "flag": "https://flagsapi.com/LS/flat/64.png"
    },
    {
        "code": "LYD",
        "name": "Libyan Dinar",
        "country": "Libya",
        "countryCode": "LY",
        "flag": "https://flagsapi.com/LY/flat/64.png"
    },
    {
        "code": "MAD",
        "name": "Moroccan Dirham",
        "country": "Morocco",
        "countryCode": "MA",
        "flag": "https://flagsapi.com/MA/flat/64.png"
    },
    {
        "code": "MDL",
        "name": "Moldovan Leu",
        "country": "Moldova",
        "countryCode": "MD",
        "flag": "https://flagsapi.com/MD/flat/64.png"
    },
    {
        "code": "MGA",
        "name": "Malagasy Ariary",
        "country": "Madagascar",
        "countryCode": "MG",
        "flag": "https://flagsapi.com/MG/flat/64.png"
    },
    {
        "code": "MKD",
        "name": "Macedonian Denar",
        "country": "North Macedonia",
        "countryCode": "MK",
        "flag": "https://flagsapi.com/MK/flat/64.png"
    },
    {
        "code": "MMK",
        "name": "Burmese Kyat",
        "country": "Myanmar",
        "countryCode": "MM",
        "flag": "https://flagsapi.com/MM/flat/64.png"
    },
    {
        "code": "MNT",
        "name": "Mongolian Tögrög",
        "country": "Mongolia",
        "countryCode": "MN",
        "flag": "https://flagsapi.com/MN/flat/64.png"
    },
    {
        "code": "MOP",
        "name": "Macanese Pataca",
        "country": "Macau",
        "countryCode": "MO",
        "flag": "https://flagsapi.com/MO/flat/64.png"
    },
    {
        "code": "MRU",
        "name": "Mauritanian Ouguiya",
        "country": "Mauritania",
        "countryCode": "MR",
        "flag": "https://flagsapi.com/MR/flat/64.png"
    },
    {
        "code": "MUR",
        "name": "Mauritian Rupee",
        "country": "Mauritius",
        "countryCode": "MU",
        "flag": "https://flagsapi.com/MU/flat/64.png"
    },
    {
        "code": "MVR",
        "name": "Maldivian Rufiyaa",
        "country": "Maldives",
        "countryCode": "MV",
        "flag": "https://flagsapi.com/MV/flat/64.png"
    },
    {
        "code": "MWK",
        "name": "Malawian Kwacha",
        "country": "Malawi",
        "countryCode": "MW",
        "flag": "https://flagsapi.com/MW/flat/64.png"
    },
    {
        "code": "MXN",
        "name": "Mexican Peso",
        "country": "Mexico",
        "countryCode": "MX",
        "flag": "https://flagsapi.com/MX/flat/64.png"
    },
    {
        "code": "MYR",
        "name": "Malaysian Ringgit",
        "country": "Malaysia",
        "countryCode": "MY",
        "flag": "https://flagsapi.com/MY/flat/64.png"
    },
    {
        "code": "MZN",
        "name": "Mozambican Metical",
        "country": "Mozambique",
        "countryCode": "MZ",
        "flag": "https://flagsapi.com/MZ/flat/64.png"
    },
    {
        "code": "NAD",
        "name": "Namibian Dollar",
        "country": "Namibia",
        "countryCode": "NA",
        "flag": "https://flagsapi.com/NA/flat/64.png"
    },
    {
        "code": "NGN",
        "name": "Nigerian Naira",
        "country": "Nigeria",
        "countryCode": "NG",
        "flag": "https://flagsapi.com/NG/flat/64.png"
    },
    {
        "code": "NIO",
        "name": "Nicaraguan Córdoba",
        "country": "Nicaragua",
        "countryCode": "NI",
        "flag": "https://flagsapi.com/NI/flat/64.png"
    },
    {
        "code": "NOK",
        "name": "Norwegian Krone",
        "country": "Norway",
        "countryCode": "NO",
        "flag": "https://flagsapi.com/NO/flat/64.png"
    },
    {
        "code": "NPR",
        "name": "Nepalese Rupee",
        "country": "Nepal",
        "countryCode": "NP",
        "flag": "https://flagsapi.com/NP/flat/64.png"
    },
    {
        "code": "NZD",
        "name": "New Zealand Dollar",
        "country": "New Zealand",
        "countryCode": "NZ",
        "flag": "https://flagsapi.com/NZ/flat/64.png"
    },
    {
        "code": "OMR",
        "name": "Omani Rial",
        "country": "Oman",
        "countryCode": "OM",
        "flag": "https://flagsapi.com/OM/flat/64.png"
    },
    {
        "code": "PAB",
        "name": "Panamanian Balboa",
        "country": "Panama",
        "countryCode": "PA",
        "flag": "https://flagsapi.com/PA/flat/64.png"
    },
    {
        "code": "PEN",
        "name": "Peruvian Sol",
        "country": "Peru",
        "countryCode": "PE",
        "flag": "https://flagsapi.com/PE/flat/64.png"
    },
    {
        "code": "PGK",
        "name": "Papua New Guinean Kina",
        "country": "Papua New Guinea",
        "countryCode": "PG",
        "flag": "https://flagsapi.com/PG/flat/64.png"
    },
    {
        "code": "PHP",
        "name": "Philippine Peso",
        "country": "Philippines",
        "countryCode": "PH",
        "flag": "https://flagsapi.com/PH/flat/64.png"
    },
    {
        "code": "PKR",
        "name": "Pakistani Rupee",
        "country": "Pakistan",
        "countryCode": "PK",
        "flag": "https://flagsapi.com/PK/flat/64.png"
    },
    {
        "code": "PLN",
        "name": "Polish Złoty",
        "country": "Poland",
        "countryCode": "PL",
        "flag": "https://flagsapi.com/PL/flat/64.png"
    },
    {
        "code": "PYG",
        "name": "Paraguayan Guaraní",
        "country": "Paraguay",
        "countryCode": "PY",
        "flag": "https://flagsapi.com/PY/flat/64.png"
    },
    {
        "code": "QAR",
        "name": "Qatari Riyal",
        "country": "Qatar",
        "countryCode": "QA",
        "flag": "https://flagsapi.com/QA/flat/64.png"
    },
    {
        "code": "RON",
        "name": "Romanian Leu",
        "country": "Romania",
        "countryCode": "RO",
        "flag": "https://flagsapi.com/RO/flat/64.png"
    },
    {
        "code": "RSD",
        "name": "Serbian Dinar",
        "country": "Serbia",
        "countryCode": "RS",
        "flag": "https://flagsapi.com/RS/flat/64.png"
    },
    {
        "code": "RUB",
        "name": "Russian Ruble",
        "country": "Russia",
        "countryCode": "RU",
        "flag": "https://flagsapi.com/RU/flat/64.png"
    },
    {
        "code": "RWF",
        "name": "Rwandan Franc",
        "country": "Rwanda",
        "countryCode": "RW",
        "flag": "https://flagsapi.com/RW/flat/64.png"
    },
    {
        "code": "SAR",
        "name": "Saudi Riyal",
        "country": "Saudi Arabia",
        "countryCode": "SA",
        "flag": "https://flagsapi.com/SA/flat/64.png"
    },
    {
        "code": "SBD",
        "name": "Solomon Islands Dollar",
        "country": "Solomon Islands",
        "countryCode": "SB",
        "flag": "https://flagsapi.com/SB/flat/64.png"
    },
    {
        "code": "SCR",
        "name": "Seychellois Rupee",
        "country": "Seychelles",
        "countryCode": "SC",
        "flag": "https://flagsapi.com/SC/flat/64.png"
    },
    {
        "code": "SDG",
        "name": "Sudanese Pound",
        "country": "Sudan",
        "countryCode": "SD",
        "flag": "https://flagsapi.com/SD/flat/64.png"
    },
    {
        "code": "SEK",
        "name": "Swedish Krona",
        "country": "Sweden",
        "countryCode": "SE",
        "flag": "https://flagsapi.com/SE/flat/64.png"
    },
    {
        "code": "SGD",
        "name": "Singapore Dollar",
        "country": "Singapore",
        "countryCode": "SG",
        "flag": "https://flagsapi.com/SG/flat/64.png"
    },
    {
        "code": "SHP",
        "name": "Saint Helena Pound",
        "country": "Saint Helena",
        "countryCode": "SH",
        "flag": "https://flagsapi.com/SH/flat/64.png"
    },
    {
        "code": "SLL",
        "name": "Sierra Leonean Leone",
        "country": "Sierra Leone",
        "countryCode": "SL",
        "flag": "https://flagsapi.com/SL/flat/64.png"
    },
    {
        "code": "SOS",
        "name": "Somali Shilling",
        "country": "Somalia",
        "countryCode": "SO",
        "flag": "https://flagsapi.com/SO/flat/64.png"
    },
    {
        "code": "SRD",
        "name": "Surinamese Dollar",
        "country": "Suriname",
        "countryCode": "SR",
        "flag": "https://flagsapi.com/SR/flat/64.png"
    },
    {
        "code": "SSP",
        "name": "South Sudanese Pound",
        "country": "South Sudan",
        "countryCode": "SS",
        "flag": "https://flagsapi.com/SS/flat/64.png"
    },
    {
        "code": "STN",
        "name": "Sao Tome and Principe Dobra",
        "country": "Sao Tome and Principe",
        "countryCode": "ST",
        "flag": "https://flagsapi.com/ST/flat/64.png"
    },
    {
        "code": "SYP",
        "name": "Syrian Pound",
        "country": "Syria",
        "countryCode": "SY",
        "flag": "https://flagsapi.com/SY/flat/64.png"
    },
    {
        "code": "SZL",
        "name": "Eswatini Lilangeni",
        "country": "Eswatini",
        "countryCode": "SZ",
        "flag": "https://flagsapi.com/SZ/flat/64.png"
    },
    {
        "code": "THB",
        "name": "Thai Baht",
        "country": "Thailand",
        "countryCode": "TH",
        "flag": "https://flagsapi.com/TH/flat/64.png"
    },
    {
        "code": "TJS",
        "name": "Tajikistani Somoni",
        "country": "Tajikistan",
        "countryCode": "TJ",
        "flag": "https://flagsapi.com/TJ/flat/64.png"
    },
    {
        "code": "TMT",
        "name": "Turkmenistan Manat",
        "country": "Turkmenistan",
        "countryCode": "TM",
        "flag": "https://flagsapi.com/TM/flat/64.png"
    },
    {
        "code": "TND",
        "name": "Tunisian Dinar",
        "country": "Tunisia",
        "countryCode": "TN",
        "flag": "https://flagsapi.com/TN/flat/64.png"
    },
    {
        "code": "TOP",
        "name": "Tongan Paʻanga",
        "country": "Tonga",
        "countryCode": "TO",
        "flag": "https://flagsapi.com/TO/flat/64.png"
    },
    {
        "code": "TRY",
        "name": "Turkish Lira",
        "country": "Turkey",
        "countryCode": "TR",
        "flag": "https://flagsapi.com/TR/flat/64.png"
    },
    {
        "code": "TTD",
        "name": "Trinidad and Tobago Dollar",
        "country": "Trinidad and Tobago",
        "countryCode": "TT",
        "flag": "https://flagsapi.com/TT/flat/64.png"
    },
    {
        "code": "TVD",
        "name": "Tuvaluan Dollar",
        "country": "Tuvalu",
        "countryCode": "TV",
        "flag": "https://flagsapi.com/TV/flat/64.png"
    },
    {
        "code": "TWD",
        "name": "New Taiwan Dollar",
        "country": "Taiwan",
        "countryCode": "TW",
        "flag": "https://flagsapi.com/TW/flat/64.png"
    },
    {
        "code": "TZS",
        "name": "Tanzanian Shilling",
        "country": "Tanzania",
        "countryCode": "TZ",
        "flag": "https://flagsapi.com/TZ/flat/64.png"
    },
    {
        "code": "UAH",
        "name": "Ukrainian Hryvnia",
        "country": "Ukraine",
        "countryCode": "UA",
        "flag": "https://flagsapi.com/UA/flat/64.png"
    },
    {
        "code": "UGX",
        "name": "Ugandan Shilling",
        "country": "Uganda",
        "countryCode": "UG",
        "flag": "https://flagsapi.com/UG/flat/64.png"
    },
    {
        "code": "USD",
        "name": "United States Dollar",
        "country": "United States",
        "countryCode": "US",
        "flag": "https://flagsapi.com/US/flat/64.png"
    },
    {
        "code": "UYU",
        "name": "Uruguayan Peso",
        "country": "Uruguay",
        "countryCode": "UY",
        "flag": "https://flagsapi.com/UY/flat/64.png"
    },
    {
        "code": "UZS",
        "name": "Uzbekistani So'm",
        "country": "Uzbekistan",
        "countryCode": "UZ",
        "flag": "https://flagsapi.com/UZ/flat/64.png"
    },
    {
        "code": "VES",
        "name": "Venezuelan Bolíconst Soberano",
        "country": "Venezuela",
        "countryCode": "VE",
        "flag": "https://flagsapi.com/VE/flat/64.png"
    },
    {
        "code": "VND",
        "name": "Vietnamese Đồng",
        "country": "Vietnam",
        "countryCode": "VN",
        "flag": "https://flagsapi.com/VN/flat/64.png"
    },
    {
        "code": "VUV",
        "name": "Vanuatu Vatu",
        "country": "Vanuatu",
        "countryCode": "VU",
        "flag": "https://flagsapi.com/VU/flat/64.png"
    },
    {
        "code": "WST",
        "name": "Samoan Tālā",
        "country": "Samoa",
        "countryCode": "WS",
        "flag": "https://flagsapi.com/WS/flat/64.png"
    },
    {
        "code": "XOF",
        "name": "West African CFA franc",
        "country": "CFA",
        "countryCode": "CF",
        "flag": "https://flagsapi.com/CF/flat/64.png"
    },
    {
        "code": "YER",
        "name": "Yemeni Rial",
        "country": "Yemen",
        "countryCode": "YE",
        "flag": "https://flagsapi.com/YE/flat/64.png"
    },
    {
        "code": "ZAR",
        "name": "South African Rand",
        "country": "South Africa",
        "countryCode": "ZA",
        "flag": "https://flagsapi.com/ZA/flat/64.png"
    },
    {
        "code": "ZMW",
        "name": "Zambian Kwacha",
        "country": "Zambia",
        "countryCode": "ZM",
        "flag": "https://flagsapi.com/ZM/flat/64.png"
    },
    {
        "code": "ZWL",
        "name": "Zimbabwean Dollar",
        "country": "Zimbabwe",
        "countryCode": "ZW",
        "flag": "https://flagsapi.com/ZW/flat/64.png"
    }
]

export default currencies;