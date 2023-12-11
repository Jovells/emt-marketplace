"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  HiOutlineFire,
} from "react-icons/hi2";
import ClaimHistoryItem from "./claim-history-item";
import ClaimExptCard from "./claim-expt-card";
import { useMutation, useQuery } from "@tanstack/react-query";
import useBackend from "@/lib/hooks/useBackend";
import { useParams } from "next/navigation";
import { useUser } from "@/lib/hooks/user";
import { useQueryClient } from "wagmi";
import { toast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import DataLoading from "@/components/ui/data-loading";
import NoData from "@/components/ui/no-data";
import { UserProfile } from "@/lib/types";

export default  function MyWallet({profile}:{profile: UserProfile}){
const{fetchUnclaimedExpt, claimMent, claimExpt, fetchUnclaimedMent, fetchClaimHistory} = useBackend()
const {user} = useUser();
const queryClient = useQueryClient()

const {data: unclaimedMent} = useQuery({
  queryKey: ["unclaimedMent", user?.uid],
  queryFn: fetchUnclaimedMent,
  enabled: !!user?.uid,
  throwOnError: (err)=>{console.log(err); return true}
})


const {data: claimHistory, isLoading: loadingHistory} = useQuery({
  queryKey: ['claimHistory', user?.uid],
  queryFn: ()=>fetchClaimHistory(),
  enabled: !!user?.uid
})

const { mutateAsync: handleClaimMent}=useMutation({
  mutationFn: claimMent,
  onSuccess: () => {
    queryClient.setQueryData(["unclaimedMent", user?.uid], ()=>{
      return 0;
    })
    toast({
      title: 'Claimed',
      variant: 'success',
      description: <div>success success success success success
      <Progress value={100} className="h-2 mt-2 w-full text-accent-4 bg-accent-shade" /></div>,
    })
  },
  onMutate:()=>{
    toast({
      title: 'Claiming..',
      duration: Infinity,
      description: <div>
      <Progress value={10} className="h-2 mt-2 w-full text-accent-4 bg-accent-shade" /></div>,

    })

  },
  onError: (e: any) => {
    // Handle error state here
    console.error("oops!", e.message)
  },
})



  return <div className="flex flex-col gap-y-4 mt-5">
                <div className="flex p-4 items-center justify-between bg-accent-shade rounded-md">
                  <div className="flex items-center">
                    <div className="flex items-center text-sm">
                      <HiOutlineFire className="w-4 h-4 ml-1 text-accent-3" />
                      <div className="ml-1 flex items-center text-muted">Unclaimed MENT: <span className="ml-1 text-foreground">{unclaimedMent}</span></div>
                    </div>
                  </div>
                  <Button onClick={() => handleClaimMent()} size="sm">Claim MENT</Button>
                </div>

                <ClaimExptCard profile={profile} />

                <h4 className="text-md text-foreground font-bold mb-5">
                  Claim History
                </h4>

                <div className="flex flex-col gap-7">
                  {claimHistory?
                  claimHistory.map((claimItem, key) => <ClaimHistoryItem key={`claim-item-${claimItem.type}-${key}`} claimItem={claimItem} />)
                  :loadingHistory?
                  <DataLoading/>:
                  <NoData message="No History"/>
                  }
                </div>
              </div>;
}
  