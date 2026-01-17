"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import {
  MagnifyingGlass,
  Funnel,
  DotsThreeVertical,
  FileText,
  CurrencyDollar,
  Calendar,
  Clock,
  CheckCircle,
  Warning,
  XCircle,
  ChatCircle,
  Download,
  Eye,
  Play,
  Pause,
  CheckSquare,
  Star,
  ArrowSquareOut,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores";

interface Milestone {
  id: string;
  title: string;
  description: string;
  amount: number;
  due_date: string;
  status: "pending" | "in_progress" | "submitted" | "approved" | "paid";
}

interface Contract {
  id: string;
  title: string;
  description: string;
  status: "pending" | "active" | "paused" | "completed" | "cancelled" | "disputed";
  total_amount: number;
  paid_amount: number;
  start_date: string;
  end_date: string;
  created_at: string;
  job: {
    id: string;
    title: string;
  };
  client: {
    id: string;
    full_name: string;
    avatar_url: string;
    company?: string;
  };
  freelancer: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
  milestones: Milestone[];
}

// Mock data
const mockContracts: Contract[] = [
  {
    id: "c1",
    title: "E-Commerce Website Development",
    description: "Build a full-featured e-commerce platform with payment integration, inventory management, and admin dashboard.",
    status: "active",
    total_amount: 5000,
    paid_amount: 2000,
    start_date: "2024-01-15",
    end_date: "2024-03-15",
    created_at: "2024-01-10",
    job: { id: "j1", title: "Senior Full Stack Developer Needed" },
    client: {
      id: "cl1",
      full_name: "Ahmad Hassan",
      avatar_url: "",
      company: "TechKurd Solutions",
    },
    freelancer: {
      id: "f1",
      full_name: "Aram Hawrami",
      avatar_url: "",
    },
    milestones: [
      {
        id: "m1",
        title: "Project Setup & Design",
        description: "Initial setup, database design, and UI/UX wireframes",
        amount: 1000,
        due_date: "2024-01-25",
        status: "paid",
      },
      {
        id: "m2",
        title: "Core Features Development",
        description: "Product catalog, shopping cart, user authentication",
        amount: 2000,
        due_date: "2024-02-15",
        status: "in_progress",
      },
      {
        id: "m3",
        title: "Payment Integration",
        description: "Integrate payment gateways and checkout flow",
        amount: 1000,
        due_date: "2024-02-28",
        status: "pending",
      },
      {
        id: "m4",
        title: "Final Delivery",
        description: "Testing, bug fixes, and deployment",
        amount: 1000,
        due_date: "2024-03-15",
        status: "pending",
      },
    ],
  },
  {
    id: "c2",
    title: "Mobile App Development",
    description: "Cross-platform mobile application for food delivery service.",
    status: "completed",
    total_amount: 8000,
    paid_amount: 8000,
    start_date: "2023-10-01",
    end_date: "2023-12-31",
    created_at: "2023-09-25",
    job: { id: "j2", title: "Mobile App Developer for Startup" },
    client: {
      id: "cl2",
      full_name: "Sara Ahmad",
      avatar_url: "",
      company: "FoodKurd",
    },
    freelancer: {
      id: "f1",
      full_name: "Aram Hawrami",
      avatar_url: "",
    },
    milestones: [
      {
        id: "m5",
        title: "Design & Prototyping",
        description: "UI/UX design and interactive prototype",
        amount: 2000,
        due_date: "2023-10-15",
        status: "paid",
      },
      {
        id: "m6",
        title: "App Development",
        description: "Core app functionality",
        amount: 4000,
        due_date: "2023-11-30",
        status: "paid",
      },
      {
        id: "m7",
        title: "Testing & Launch",
        description: "QA testing and app store deployment",
        amount: 2000,
        due_date: "2023-12-31",
        status: "paid",
      },
    ],
  },
  {
    id: "c3",
    title: "Brand Identity Design",
    description: "Complete brand identity package including logo, business cards, and style guide.",
    status: "pending",
    total_amount: 1500,
    paid_amount: 0,
    start_date: "2024-02-01",
    end_date: "2024-02-28",
    created_at: "2024-01-28",
    job: { id: "j3", title: "Graphic Designer for Brand Refresh" },
    client: {
      id: "cl3",
      full_name: "Layla Hassan",
      avatar_url: "",
      company: "Bloom Café",
    },
    freelancer: {
      id: "f1",
      full_name: "Aram Hawrami",
      avatar_url: "",
    },
    milestones: [
      {
        id: "m8",
        title: "Initial Concepts",
        description: "3 logo concepts and mood boards",
        amount: 500,
        due_date: "2024-02-07",
        status: "pending",
      },
      {
        id: "m9",
        title: "Refinement",
        description: "Refine chosen concept",
        amount: 500,
        due_date: "2024-02-14",
        status: "pending",
      },
      {
        id: "m10",
        title: "Final Deliverables",
        description: "All brand assets and style guide",
        amount: 500,
        due_date: "2024-02-28",
        status: "pending",
      },
    ],
  },
];

const statusConfig: Record<Contract["status"], { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700", icon: <Clock className="h-4 w-4" /> },
  active: { label: "Active", color: "bg-green-100 text-green-700", icon: <Play className="h-4 w-4" /> },
  paused: { label: "Paused", color: "bg-orange-100 text-orange-700", icon: <Pause className="h-4 w-4" /> },
  completed: { label: "Completed", color: "bg-blue-100 text-blue-700", icon: <CheckCircle className="h-4 w-4" /> },
  cancelled: { label: "Cancelled", color: "bg-gray-100 text-gray-700", icon: <XCircle className="h-4 w-4" /> },
  disputed: { label: "Disputed", color: "bg-red-100 text-red-700", icon: <Warning className="h-4 w-4" /> },
};

const milestoneStatusConfig: Record<Milestone["status"], { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-gray-100 text-gray-700" },
  in_progress: { label: "In Progress", color: "bg-blue-100 text-blue-700" },
  submitted: { label: "Submitted", color: "bg-purple-100 text-purple-700" },
  approved: { label: "Approved", color: "bg-green-100 text-green-700" },
  paid: { label: "Paid", color: "bg-emerald-100 text-emerald-700" },
};

export function ContractsContent() {
  const { user, freelancerProfile } = useAuthStore();
  const isFreelancer = !!freelancerProfile;
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  useEffect(() => {
    const fetchContracts = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setContracts(mockContracts);
      setIsLoading(false);
    };

    fetchContracts();
  }, []);

  const filteredContracts = contracts.filter((contract) =>
    contract.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (isFreelancer 
      ? contract.client.full_name.toLowerCase().includes(searchQuery.toLowerCase())
      : contract.freelancer.full_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const activeContracts = filteredContracts.filter((c) => c.status === "active");
  const pendingContracts = filteredContracts.filter((c) => c.status === "pending");
  const completedContracts = filteredContracts.filter((c) => c.status === "completed");
  const otherContracts = filteredContracts.filter((c) => 
    !["active", "pending", "completed"].includes(c.status)
  );

  const handleSubmitMilestone = (contractId: string, milestoneId: string) => {
    toast.success("Milestone submitted for review!");
    // Update state
    setContracts((prev) =>
      prev.map((c) =>
        c.id === contractId
          ? {
              ...c,
              milestones: c.milestones.map((m) =>
                m.id === milestoneId ? { ...m, status: "submitted" as const } : m
              ),
            }
          : c
      )
    );
  };

  const handleApproveMilestone = (contractId: string, milestoneId: string) => {
    toast.success("Milestone approved! Payment released.");
    // Update state
    setContracts((prev) =>
      prev.map((c) =>
        c.id === contractId
          ? {
              ...c,
              milestones: c.milestones.map((m) =>
                m.id === milestoneId ? { ...m, status: "paid" as const } : m
              ),
              paid_amount: c.paid_amount + (c.milestones.find((m) => m.id === milestoneId)?.amount || 0),
            }
          : c
      )
    );
  };

  const handleSubmitReview = () => {
    if (reviewRating === 0) {
      toast.error("Please select a rating");
      return;
    }
    toast.success("Review submitted successfully!");
    setReviewDialogOpen(false);
    setReviewRating(0);
    setReviewComment("");
  };

  const ContractCard = ({ contract }: { contract: Contract }) => {
    const progress = (contract.paid_amount / contract.total_amount) * 100;
    const status = statusConfig[contract.status];
    const otherParty = isFreelancer ? contract.client : contract.freelancer;

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={otherParty.avatar_url} />
                <AvatarFallback>{otherParty.full_name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold line-clamp-1">{contract.title}</h3>
                <p className="text-sm text-gray-500">
                  {isFreelancer ? "Client" : "Freelancer"}: {otherParty.full_name}
                  {isFreelancer && contract.client.company && (
                    <span className="text-gray-400"> • {contract.client.company}</span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={status.color}>
                {status.icon}
                <span className="ml-1">{status.label}</span>
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <DotsThreeVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSelectedContract(contract)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ChatCircle className="h-4 w-4 mr-2" />
                    Message
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="h-4 w-4 mr-2" />
                    Download Contract
                  </DropdownMenuItem>
                  {contract.status === "completed" && (
                    <DropdownMenuItem onClick={() => {
                      setSelectedContract(contract);
                      setReviewDialogOpen(true);
                    }}>
                      <Star className="h-4 w-4 mr-2" />
                      Leave Review
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {contract.description}
          </p>

          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
            <span className="flex items-center gap-1">
              <CurrencyDollar className="h-4 w-4" />
              ${contract.total_amount.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(contract.start_date).toLocaleDateString()} - {new Date(contract.end_date).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <CheckSquare className="h-4 w-4" />
              {contract.milestones.filter((m) => m.status === "paid").length}/{contract.milestones.length} milestones
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Payment Progress</span>
              <span className="font-medium">
                ${contract.paid_amount.toLocaleString()} / ${contract.total_amount.toLocaleString()}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-64" />
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Contracts</h1>
          <p className="text-gray-500">Manage your active and past contracts</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search contracts..."
              className="pl-9 w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Funnel className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Play className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeContracts.length}</p>
                <p className="text-sm text-gray-500">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingContracts.length}</p>
                <p className="text-sm text-gray-500">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedContracts.length}</p>
                <p className="text-sm text-gray-500">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <CurrencyDollar className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  ${contracts.reduce((sum, c) => sum + c.paid_amount, 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">Total Earned</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">
            Active ({activeContracts.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({pendingContracts.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedContracts.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            All ({filteredContracts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6 space-y-4">
          {activeContracts.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Play className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No active contracts</h3>
                <p className="text-gray-500 mb-4">
                  Your active contracts will appear here
                </p>
                <Button asChild>
                  <Link href="/jobs">Browse Jobs</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            activeContracts.map((contract) => (
              <ContractCard key={contract.id} contract={contract} />
            ))
          )}
        </TabsContent>

        <TabsContent value="pending" className="mt-6 space-y-4">
          {pendingContracts.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No pending contracts</h3>
                <p className="text-gray-500">
                  Pending contracts awaiting acceptance will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            pendingContracts.map((contract) => (
              <ContractCard key={contract.id} contract={contract} />
            ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6 space-y-4">
          {completedContracts.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No completed contracts</h3>
                <p className="text-gray-500">
                  Your completed contracts will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            completedContracts.map((contract) => (
              <ContractCard key={contract.id} contract={contract} />
            ))
          )}
        </TabsContent>

        <TabsContent value="all" className="mt-6 space-y-4">
          {filteredContracts.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No contracts found</h3>
                <p className="text-gray-500">
                  {searchQuery
                    ? "Try adjusting your search"
                    : "Start applying to jobs to get contracts"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredContracts.map((contract) => (
              <ContractCard key={contract.id} contract={contract} />
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Contract Detail Dialog */}
      <Dialog open={!!selectedContract && !reviewDialogOpen} onOpenChange={() => setSelectedContract(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedContract && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <DialogTitle>{selectedContract.title}</DialogTitle>
                  <Badge className={statusConfig[selectedContract.status].color}>
                    {statusConfig[selectedContract.status].label}
                  </Badge>
                </div>
                <DialogDescription>
                  Contract with {isFreelancer ? selectedContract.client.full_name : selectedContract.freelancer.full_name}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Contract Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Total Value</p>
                    <p className="font-semibold">${selectedContract.total_amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Paid</p>
                    <p className="font-semibold">${selectedContract.paid_amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Start Date</p>
                    <p className="font-semibold">{new Date(selectedContract.start_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">End Date</p>
                    <p className="font-semibold">{new Date(selectedContract.end_date).toLocaleDateString()}</p>
                  </div>
                </div>

                <Separator />

                {/* Description */}
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-gray-600">{selectedContract.description}</p>
                </div>

                <Separator />

                {/* Milestones */}
                <div>
                  <h4 className="font-medium mb-4">Milestones</h4>
                  <div className="space-y-4">
                    {selectedContract.milestones.map((milestone, idx) => (
                      <Card key={milestone.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm text-gray-500">#{idx + 1}</span>
                                <h5 className="font-medium">{milestone.title}</h5>
                                <Badge className={milestoneStatusConfig[milestone.status].color}>
                                  {milestoneStatusConfig[milestone.status].label}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{milestone.description}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  <CurrencyDollar className="h-4 w-4" />
                                  ${milestone.amount.toLocaleString()}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  Due: {new Date(milestone.due_date).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <div>
                              {isFreelancer && milestone.status === "in_progress" && (
                                <Button
                                  size="sm"
                                  onClick={() => handleSubmitMilestone(selectedContract.id, milestone.id)}
                                >
                                  Submit for Review
                                </Button>
                              )}
                              {!isFreelancer && milestone.status === "submitted" && (
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => handleApproveMilestone(selectedContract.id, milestone.id)}
                                >
                                  Approve & Pay
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Overall Progress</span>
                    <span className="font-medium">
                      {Math.round((selectedContract.paid_amount / selectedContract.total_amount) * 100)}%
                    </span>
                  </div>
                  <Progress
                    value={(selectedContract.paid_amount / selectedContract.total_amount) * 100}
                    className="h-3"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedContract(null)}>
                  Close
                </Button>
                <Button asChild>
                  <Link href={`/messages?contract=${selectedContract.id}`}>
                    <ChatCircle className="h-4 w-4 mr-2" />
                    Open Chat
                  </Link>
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave a Review</DialogTitle>
            <DialogDescription>
              Share your experience working with {selectedContract && (isFreelancer ? selectedContract.client.full_name : selectedContract.freelancer.full_name)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Rating</label>
              <div className="flex items-center gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= reviewRating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Comment</label>
              <Textarea
                placeholder="Share your experience..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="mt-2"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitReview}>Submit Review</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
