import { client } from "@/app/client";
import Link from "next/link";
import { getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { useReadContract } from "thirdweb/react";

type CampaignCardProps = {
    campaignAddress: string;
};

export const CampaignCard: React.FC<CampaignCardProps> = ({ campaignAddress }) => {
    const contract = getContract({
        client: client,
        chain: baseSepolia,
        address: campaignAddress,
    });

    // Get Campaign Name
    const {data: campaignName} = useReadContract({
        contract: contract,
        method: "function name() view returns (string)",
        params: []
    });

    // Get Campaign Description
    const {data: campaignDescription} = useReadContract({
        contract: contract,
        method: "function description() view returns (string)",
        params: []
    });

    // Goal amount of the campaign
    const { data: goal, isLoading: isLoadingGoal } = useReadContract({
        contract: contract,
        method: "function goal() view returns (uint256)",
        params: [],
    });

    // Total funded balance of the campaign
    const { data: balance, isLoading: isLoadingBalance } = useReadContract({
        contract: contract,
        method: "function getContractBalance() view returns (uint256)",
        params: [],
    });

    // Calulate the total funded balance percentage
    const totalBalance = balance?.toString();
    const totalGoal = goal?.toString();
    let balancePercentage = (parseInt(totalBalance as string) / parseInt(totalGoal as string)) * 100;

    // If balance is greater than or equal to goal, percentage should be 100
    if (balancePercentage >= 100) {
        balancePercentage = 100;
    }

    return (
            <div className="mt-20 flex flex-col justify-between w-[303px] h-[242px] pl-10 p-6 bg-white border border-slate-200 rounded-lg shadow">
                
                <div>

                    <h5 className="mb-2 text-2xl text-[#2C0034] font-bold tracking-tight">{campaignName}</h5>
                    
                    <p className="mb-3 font-normal text-[#2C0034] dark:text-[#2C0034]">{campaignDescription}</p>

                   
                </div>
                
                    <div className="">

                    {!isLoadingBalance && (
                        <div className="mb-3">
                                             {/* <p className="absolute h-[8px] bottom-[12px] right-0 text-black  text-xs p-1">
                                   {balancePercentage >= 100 ? "" : `${balancePercentage?.toString()}%`}
                             </p>
                         */}
                            <div className="relative w-full h-[13px] bg-[#c9b8cb] rounded-full dark:bg-[#c9b8cb]">
                            
                                <div className="h-[13px] p-[1px] w-full bg-[#2C0034] rounded-full dark:bg-[#B952CC] text-right" style={{ width: `${balancePercentage?.toString()}%`}}>
                                    <p className="text-white mb-[2px] dark:text-white text-xs">${balance?.toString()}</p>
                                </div>
                               
                            </div>
                        </div>
                        
                    )}
                    <Link
                    href={`/campaign/${campaignAddress}`}
                    passHref={true}
                >
                    <div className="h-[40px] bg-[#2c0035] rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-[#2c0035] dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    <p className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white">
                        View Campaign
                        <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                        </svg>
                    </p>
                    </div>
                    
                    </Link>
                    </div>
                
            </div>
    )
};