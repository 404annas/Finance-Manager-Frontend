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
                const response = await fetch(
                    `${import.meta.env.VITE_CURRENCY_CONVERTER_BASE_URL}/${fromCurrency}`
                );
                const data = await response.json();
                if (data && data.rates) {
                    setRate(data.rates[toCurrency]);
                }
            } catch (error) {
                console.log("Error fetching exchange rate:", error);
            }
        };
        fetchExchangeRate();
    }, [fromCurrency, toCurrency]);

    return (
        <div className="flex justify-center">
            <div className="bg-[#F6F9FC] shadow-sm w-76 sm:max-w-[90rem] py-5 px-4 sm:p-8 md:p-10">
                <h2 className="text-xl sm:text-2xl md:text-3xl p-bold text-[#6667DF] text-center mb-6">
                    💱 Currency Exchange
                </h2>

                {/* Amount Input */}
                <div className="mb-6">
                    <label className="block text-gray-600 p-medium mb-2 text-sm sm:text-base">
                        Amount
                    </label>
                    <input
                        type="number"
                        value={amount}
                        min={0}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full p-2.5 sm:p-3 md:p-3.5 rounded-xl outline-none border-2 border-[#6667DF] text-gray-700 p-regular text-sm sm:text-base"
                    />
                </div>

                {/* From & To Selectors */}
                <div className="flex flex-col sm:flex-row items-stretch justify-between gap-5 sm:gap-6 mb-6">
                    {/* From Currency */}
                    <div className="flex-1">
                        <label className="block text-gray-600 p-medium mb-2 text-sm sm:text-base">
                            From
                        </label>
                        <div className="flex items-center border-2 border-[#6667DF] rounded-xl p-2.5 sm:p-3">
                            <img
                                src={currencies.find((c) => c.code === fromCurrency)?.flag}
                                alt="flag"
                                className="w-5 h-5 sm:w-6 sm:h-6 mr-2 rounded-full object-cover"
                            />
                            <select
                                value={fromCurrency}
                                onChange={(e) => setFromCurrency(e.target.value)}
                                className="flex-1 outline-none p-regular cursor-pointer text-sm sm:text-base bg-transparent appearance-none"
                                style={{ backgroundPosition: "right 0.75rem center", backgroundRepeat: "no-repeat" }}
                            >
                                {currencies.map((c) => (
                                    <option key={c.code} value={c.code}>
                                        {c.name} ({c.code})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Arrow Icon */}
                    <div className="flex justify-center items-center transform sm:rotate-0 rotate-90">
                        <ArrowRightLeft
                            className="text-gray-600"
                            size={26}
                        />
                    </div>

                    {/* To Currency */}
                    <div className="flex-1">
                        <label className="block text-gray-600 p-medium mb-2 text-sm sm:text-base">
                            To
                        </label>
                        <div className="flex items-center border-2 border-[#6667DF] rounded-xl p-2.5 sm:p-3">
                            <img
                                src={currencies.find((c) => c.code === toCurrency)?.flag}
                                alt="flag"
                                className="w-5 h-5 sm:w-6 sm:h-6 mr-2 rounded-full object-cover"
                            />
                            <select
                                value={toCurrency}
                                onChange={(e) => setToCurrency(e.target.value)}
                                className="flex-1 outline-none p-regular cursor-pointer text-sm sm:text-base bg-transparent appearance-none"
                                style={{ backgroundPosition: "right 0.75rem center", backgroundRepeat: "no-repeat" }}
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
                <div className="bg-gray-100 rounded-xl p-3 sm:p-4 text-center">
                    <p className="text-base sm:text-lg text-gray-700 p-medium leading-relaxed break-words">
                        {amount} {fromCurrency} ={" "}
                        <span className="p-bold text-[#6667DF]">
                            {rate
                                ? (amount * rate).toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })
                                : "---"}
                        </span>{" "}
                        {toCurrency}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CurrencyExchange;
