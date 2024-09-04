'use client';
import { client } from "@/app/client";
import { CROWDFUNDING_FACTORY } from "@/app/constants/contracts";
import { MyCampaignCard } from "@/components/MyCampaignCard";
import { useState } from "react";
import { getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { deployPublishedContract } from "thirdweb/deploys";
import { useActiveAccount, useReadContract } from "thirdweb/react"

export default function DashboardPage() {
    const account = useActiveAccount();

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const contract = getContract({
        client: client,
        chain: baseSepolia,
        address: CROWDFUNDING_FACTORY,
    });

    // Get Campaigns
    const { data: myCampaigns, isLoading: isLoadingMyCampaigns, refetch } = useReadContract({
        contract: contract,
        method: "function getUserCampaigns(address _user) view returns ((address campaignAddress, address owner, string name, uint256 creationTime)[])",
        params: [account?.address as string]
    });


    return (
        <div className="mx-auto max-w-7xl px-4 mt-16 sm:px-6 lg:px-8">
            <div className="flex flex-row justify-between items-center mb-8">
                <p className="text-4xl font-semibold">Dashboard</p>
                {myCampaigns && myCampaigns.length > 1 ? <button
                    className="px-4 py-2  bg-[#2C0034] text-white rounded-md"
                    onClick={() => setIsModalOpen(true)}
                >Create Campaign</button> : ''}


            </div>
            <p className="text-2xl font-semibold mb-4">My Campaigns:</p>
            <div className="grid grid-cols-3 gap-4">
                {!isLoadingMyCampaigns && (
                    myCampaigns && myCampaigns.length > 0 ? (
                        myCampaigns.map((campaign, index) => (
                            <MyCampaignCard
                                key={index}
                                contractAddress={campaign.campaignAddress}
                            />
                        ))
                    ) : (
                        <div className="w-full gap-5 col-span-full  flex items-center justify-center flex-col ">

                            <p className="font-[500] text-[64px] loading-[76px]">Wow, Such Empty.</p>
                            <p className="font-[400] text-[20px] loading-[27px]">Start by Creating a Campaign</p>
                            <button
                                className="px-4 py-2 bg-[#2C0034] text-white rounded-md"
                                onClick={() => setIsModalOpen(true)}
                            > + Create Campaign</button>
                        </div>
                    )
                )}
            </div>

            {isModalOpen && (
                <CreateCampaignModal
                    setIsModalOpen={setIsModalOpen}
                    refetch={refetch}
                />
            )}
        </div>
    )
}

type CreateCampaignModalProps = {
    setIsModalOpen: (value: boolean) => void
    refetch: () => void
}

const CreateCampaignModal = (
    { setIsModalOpen, refetch }: CreateCampaignModalProps
) => {
    const account = useActiveAccount();
    const [isDeployingContract, setIsDeployingContract] = useState<boolean>(false);
    const [campaignName, setCampaignName] = useState<string>("");
    const [campaignDescription, setCampaignDescription] = useState<string>("");
    const [campaignGoal, setCampaignGoal] = useState<number>(1);
    const [campaignDeadline, setCampaignDeadline] = useState<number>(1);

    // Deploy contract from CrowdfundingFactory
    const handleDeployContract = async () => {
        setIsDeployingContract(true);
        try {
            console.log("Deploying contract...");
            const contractAddress = await deployPublishedContract({
                client: client,
                chain: baseSepolia,
                account: account!,
                contractId: "Crowdfunding",
                contractParams: [
                    campaignName,
                    campaignDescription,
                    campaignGoal,
                    campaignDeadline
                ],
                // publisher: "0xEe29620D0c544F00385032dfCd3Da3f99Affb8B2",
                publisher: "0xF972a8932EF9484b7374fa31693D81024F8bfaEd",
                version: "1.0.5",
            });
            alert("Contract deployed successfully!");
        } catch (error) {
            console.error(error);
        } finally {
            setIsDeployingContract(false);
            setIsModalOpen(false);
            refetch
        }
    };

    const handleCampaignGoal = (value: number) => {
        if (value < 1) {
            setCampaignGoal(1);
        } else {
            setCampaignGoal(value);
        }
    }

    const handleCampaignLengthhange = (value: number) => {
        if (value < 1) {
            setCampaignDeadline(1);
        } else {
            setCampaignDeadline(value);
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center backdrop-blur-md">
            <div className="w-1/2 bg-slate-100 p-6 rounded-md">
                <div className="flex justify-between items-center mb-4">
                    <p className="text-2xl font-semibold">Create a Campaign</p>
                    <button
                        className="text-black font-bold text-2xl"
                        onClick={() => setIsModalOpen(false)}
                    >X</button>
                </div>
                <div className="flex flex-col">
                    <label className="font-bold">Enter Campaign Name: </label>
                    <input
                        type="text"
                        value={campaignName}
                        onChange={(e) => setCampaignName(e.target.value)}
                        placeholder="Campaign Name"
                        className="mb-4 px-4 py-2 bg-[#F9E4FC] rounded-md text-[#8D4A99]"
                    />
                    <label className="font-bold">Campaign Description:</label>
                    <textarea
                        value={campaignDescription}
                        onChange={(e) => setCampaignDescription(e.target.value)}
                        placeholder="Campaign Description"
                        className="mb-4 px-4 py-2 bg-[#F9E4FC] rounded-md text-[#8D4A99]"
                    ></textarea>
                    <label className="font-bold">Campaign Goal:</label>
                    <input
                        type="number"
                        value={campaignGoal}
                        onChange={(e) => handleCampaignGoal(parseInt(e.target.value))}
                        className="mb-4 px-4 py-2 bg-[#F9E4FC] rounded-md text-[#8D4A99]"
                    />
                    <label className="font-bold">{`Campaign Length (Days)`}</label>
                    <div className="flex space-x-4">
                        <input
                            type="number"
                            value={campaignDeadline}
                            onChange={(e) => handleCampaignLengthhange(parseInt(e.target.value))}
                            className="mb-4 px-4 py-2 bg-[#F9E4FC] rounded-md text-[#8D4A99]"
                        />
                    </div>

                    <button
                        className="mt-4 px-4 py-2 bg-[#2C0034] text-white rounded-md"
                        onClick={handleDeployContract}
                    >{
                            isDeployingContract ? "Creating Campaign..." : "Create Campaign"
                        }</button>

                </div>
            </div>
        </div>
    )
}