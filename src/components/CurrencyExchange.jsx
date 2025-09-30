import React, { useEffect, useState } from "react";
import { ArrowRightLeft } from "lucide-react";
import currencies from "./currencies";

const CurrencyExchange = () => {
    const [fromCurrency, setFromCurrency] = useState("USD");
    const [toCurrency, setToCurrency] = useState("PKR");
    const [amount, setAmount] = useState(1);
    const [rate, setRate] = useState(null);

    useEffect(() => {
        const fetchExchangeRate = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_CURRENCY_CONVERTER_BASE_URL}/${fromCurrency}`);
                const data = await response.json();
                console.log(data);
                if (data && data.rates) {
                    setRate(data.rates[toCurrency]);
                }
            } catch (error) {
                console.log("Error fetching exchange rate:", error);
            }
        }
        fetchExchangeRate();
    }, [fromCurrency, toCurrency]);

    return (
        <div className="flex justify-center">
            <div className="bg-[#F6F9FC] shadow-sm rounded-2xl p-8 w-full max-w-4xl">
                <h2 className="text-2xl p-bold text-[#6667DF] text-center mb-6">
                    💱 Currency Exchange
                </h2>

                {/* Amount Input */}
                <div className="mb-6">
                    <label className="block text-gray-600 p-medium mb-2">Amount</label>
                    <input
                        type="number"
                        value={amount}
                        min={0}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full p-3 rounded-xl outline-none border-2 border-[#6667DF] text-gray-700 p-regular"
                    />
                </div>

                {/* From & To Selectors */}
                <div className="flex items-center justify-between gap-4 mb-6">
                    {/* From Currency */}
                    <div className="flex-1">
                        <label className="block text-gray-600 p-medium mb-2">From</label>
                        <div className="flex items-center border-2 border-[#6667DF] rounded-xl p-3">
                            <img
                                src={currencies.find((c) => c.code === fromCurrency)?.flag}
                                alt="flag"
                                className="w-6 h-6 mr-2 rounded-full"
                            />
                            <select
                                value={fromCurrency}
                                onChange={(e) => setFromCurrency(e.target.value)}
                                className="flex-1 outline-none p-regular cursor-pointer"
                            >
                                {currencies.map((c) => (
                                    <option key={c.code} value={c.code}>
                                        {c.name} ({c.code})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <ArrowRightLeft className="text-gray-600 mt-7" size={28} />

                    {/* To Currency */}
                    <div className="flex-1">
                        <label className="block text-gray-600 p-medium mb-2">To</label>
                        <div className="flex items-center border-2 border-[#6667DF] rounded-xl p-3">
                            <img
                                src={currencies.find((c) => c.code === toCurrency)?.flag}
                                alt="flag"
                                className="w-6 h-6 mr-2 rounded-full"
                            />
                            <select
                                value={toCurrency}
                                onChange={(e) => setToCurrency(e.target.value)}
                                className="flex-1 outline-none p-regular cursor-pointer"
                            >
                                {currencies.map((c) => (
                                    <option key={c.code} value={c.code}>
                                        {c.name} ({c.code})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Result */}
                <div className="bg-gray-100 rounded-xl p-4 text-center">
                    <p className="text-lg text-gray-700 p-medium">
                        {amount} {fromCurrency} ={" "}
                        <span className="p-bold text-[#6667DF]">
                            {rate ? (amount * rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "---"}
                        </span>{" "}
                        {toCurrency}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CurrencyExchange;
