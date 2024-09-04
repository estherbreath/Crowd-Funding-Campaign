'use client';
import { useReadContract } from "thirdweb/react";
import { client } from "./client";
import { baseSepolia } from "thirdweb/chains";
import { getContract } from "thirdweb";
import { CampaignCard } from "@/components/CampaignCard";
import { CROWDFUNDING_FACTORY } from "./constants/contracts";
import Image from "next/image";
import background from "./image/background.png"
import Link from "next/link";
import { ConnectButton, darkTheme, useActiveAccount } from "thirdweb/react";

export default function Home() {
  const account = useActiveAccount();
  // Get CrowdfundingFactory contract
  const contract = getContract({
    client: client,
    chain: baseSepolia,
    address: CROWDFUNDING_FACTORY,
  });

  // Get all campaigns deployed with CrowdfundingFactory
  const {data: campaigns, isLoading: isLoadingCampaigns, refetch: refetchCampaigns } =  useReadContract({
    contract: contract,
    method: "function getAllCampaigns() view returns ((address campaignAddress, address owner, string name)[])",
    params: []
  });



  return (
    <main className="text-center mx-auto pb-20 max-w-7xl px-4 mt-4 sm:px-6 lg:px-8">
      <div className="">
        <div className="text-center">
          <Image
          src={background}
          height={800}
          width={800}
          alt="background"
          className="w-[90rem] object-cover"
          />
          
            <div className="absolute bottom-[19rem]">
              <h1 className="relative uppercase left-[23rem] bottom-[6rem] font-jerry font-bold text-4xl  text-white">
                Arex: Fund the change,<br/> one project at a time
              </h1>
              <div>
                <Link  href={`/dashboard/${account?.address}`}>
                <button className="bg-transparent border-white border-2 relative left-[23rem] top-[12rem] p-2 rounded-sm text-white">CREATE CAMPAIGN</button>
                </Link>
            </div>
            </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {!isLoadingCampaigns && campaigns && (
            campaigns.length > 0 ? (
              campaigns.map((campaign) => (
                <CampaignCard
                  key={campaign.campaignAddress}
                  campaignAddress={campaign.campaignAddress}
                />
              ))
            ) : (
              <p>No Campaigns</p>
            )
          )}
        </div>
      </div>
    </main>
  );
}
