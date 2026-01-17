"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  CreditCard,
  Building2,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Filter,
  Plus,
  Eye,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores";

interface Transaction {
  id: string;
  type: "earning" | "withdrawal" | "refund" | "fee";
  amount: number;
  description: string;
  status: "completed" | "pending" | "failed";
  date: string;
  reference?: string;
  contract?: {
    id: string;
    title: string;
  };
  client?: {
    full_name: string;
    avatar_url: string;
  };
}

interface PaymentMethod {
  id: string;
  type: "bank" | "paypal" | "wise" | "fastpay";
  name: string;
  details: string;
  is_default: boolean;
}

interface EarningsStats {
  available_balance: number;
  pending_balance: number;
  total_earned: number;
  this_month: number;
  last_month: number;
  total_withdrawn: number;
}

// Mock data
const mockStats: EarningsStats = {
  available_balance: 4250.00,
  pending_balance: 2000.00,
  total_earned: 125000.00,
  this_month: 8500.00,
  last_month: 7200.00,
  total_withdrawn: 118750.00,
};

const mockTransactions: Transaction[] = [
  {
    id: "t1",
    type: "earning",
    amount: 2000,
    description: "Milestone payment: Core Features Development",
    status: "completed",
    date: "2024-01-28",
    reference: "PAY-2024-001234",
    contract: { id: "c1", title: "E-Commerce Website Development" },
    client: { full_name: "Ahmad Hassan", avatar_url: "" },
  },
  {
    id: "t2",
    type: "withdrawal",
    amount: 3000,
    description: "Withdrawal to Bank Account",
    status: "completed",
    date: "2024-01-25",
    reference: "WD-2024-000987",
  },
  {
    id: "t3",
    type: "fee",
    amount: 100,
    description: "Platform service fee (5%)",
    status: "completed",
    date: "2024-01-28",
    reference: "FEE-2024-001234",
  },
  {
    id: "t4",
    type: "earning",
    amount: 1000,
    description: "Milestone payment: Project Setup & Design",
    status: "completed",
    date: "2024-01-20",
    reference: "PAY-2024-001200",
    contract: { id: "c1", title: "E-Commerce Website Development" },
    client: { full_name: "Ahmad Hassan", avatar_url: "" },
  },
  {
    id: "t5",
    type: "earning",
    amount: 2000,
    description: "Milestone payment: Testing & Launch",
    status: "pending",
    date: "2024-01-30",
    reference: "PAY-2024-001300",
    contract: { id: "c2", title: "Mobile App Development" },
    client: { full_name: "Sara Ahmad", avatar_url: "" },
  },
  {
    id: "t6",
    type: "withdrawal",
    amount: 5000,
    description: "Withdrawal to PayPal",
    status: "pending",
    date: "2024-01-29",
    reference: "WD-2024-001000",
  },
];

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "pm1",
    type: "bank",
    name: "Bank Account",
    details: "Kurdistan International Bank ****4521",
    is_default: true,
  },
  {
    id: "pm2",
    type: "fastpay",
    name: "FastPay",
    details: "aram.hawrami@fastpay.iq",
    is_default: false,
  },
];

const transactionTypeConfig = {
  earning: { label: "Earning", color: "text-green-600", bgColor: "bg-green-100", icon: ArrowUpRight },
  withdrawal: { label: "Withdrawal", color: "text-blue-600", bgColor: "bg-blue-100", icon: ArrowDownRight },
  refund: { label: "Refund", color: "text-orange-600", bgColor: "bg-orange-100", icon: ArrowUpRight },
  fee: { label: "Fee", color: "text-red-600", bgColor: "bg-red-100", icon: ArrowDownRight },
};

const transactionStatusConfig = {
  completed: { label: "Completed", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  failed: { label: "Failed", color: "bg-red-100 text-red-700", icon: AlertCircle },
};

export function EarningsContent() {
  const { user, freelancerProfile } = useAuthStore();
  const [stats, setStats] = useState<EarningsStats | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [addPaymentDialogOpen, setAddPaymentDialogOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [filterPeriod, setFilterPeriod] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStats(mockStats);
      setTransactions(mockTransactions);
      setPaymentMethods(mockPaymentMethods);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (stats && amount > stats.available_balance) {
      toast.error("Insufficient balance");
      return;
    }
    if (!selectedPaymentMethod) {
      toast.error("Please select a payment method");
      return;
    }
    toast.success(`Withdrawal of $${amount.toFixed(2)} initiated!`);
    setWithdrawDialogOpen(false);
    setWithdrawAmount("");
    setSelectedPaymentMethod("");
  };

  const handleSetDefault = (methodId: string) => {
    setPaymentMethods((prev) =>
      prev.map((pm) => ({ ...pm, is_default: pm.id === methodId }))
    );
    toast.success("Default payment method updated");
  };

  const handleAddPaymentMethod = () => {
    toast.success("Payment method added successfully");
    setAddPaymentDialogOpen(false);
  };

  const monthChange = stats
    ? ((stats.this_month - stats.last_month) / stats.last_month) * 100
    : 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 lg:col-span-2" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Earnings</h1>
          <p className="text-gray-500">Manage your earnings and withdrawals</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Dialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Wallet className="h-4 w-4 mr-2" />
                Withdraw
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Withdraw Funds</DialogTitle>
                <DialogDescription>
                  Transfer your available balance to your preferred payment method
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-500">Available Balance</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${stats?.available_balance.toLocaleString()}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Amount</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="number"
                      placeholder="0.00"
                      className="pl-9"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                    />
                  </div>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-sm"
                    onClick={() => setWithdrawAmount(stats?.available_balance.toString() || "")}
                  >
                    Withdraw all
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method.id} value={method.id}>
                          <div className="flex items-center gap-2">
                            {method.type === "bank" && <Building2 className="h-4 w-4" />}
                            {method.type === "fastpay" && <CreditCard className="h-4 w-4" />}
                            <span>{method.name}</span>
                            {method.is_default && (
                              <Badge variant="secondary" className="text-xs">Default</Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-500">Withdrawal Fee</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>You&apos;ll Receive</span>
                    <span>${withdrawAmount || "0.00"}</span>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setWithdrawDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleWithdraw}>Withdraw</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Wallet className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">Available Balance</p>
            <p className="text-2xl font-bold">${stats?.available_balance.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">Pending</p>
            <p className="text-2xl font-bold">${stats?.pending_balance.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              {monthChange !== 0 && (
                <Badge
                  variant="secondary"
                  className={monthChange > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}
                >
                  {monthChange > 0 ? "+" : ""}{monthChange.toFixed(1)}%
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-500 mb-1">This Month</p>
            <p className="text-2xl font-bold">${stats?.this_month.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">Total Earned</p>
            <p className="text-2xl font-bold">${stats?.total_earned.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transactions */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>Your recent earnings and withdrawals</CardDescription>
              </div>
              <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="earnings">Earnings</TabsTrigger>
                  <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="mt-4">
                  <div className="space-y-4">
                    {transactions.map((transaction) => {
                      const typeConfig = transactionTypeConfig[transaction.type];
                      const statusConfig = transactionStatusConfig[transaction.status];
                      const TypeIcon = typeConfig.icon;
                      const StatusIcon = statusConfig.icon;

                      return (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-full ${typeConfig.bgColor}`}>
                              <TypeIcon className={`h-5 w-5 ${typeConfig.color}`} />
                            </div>
                            <div>
                              <p className="font-medium">{transaction.description}</p>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span>{new Date(transaction.date).toLocaleDateString()}</span>
                                {transaction.reference && (
                                  <>
                                    <span>•</span>
                                    <span>{transaction.reference}</span>
                                  </>
                                )}
                              </div>
                              {transaction.client && (
                                <div className="flex items-center gap-2 mt-1">
                                  <Avatar className="h-5 w-5">
                                    <AvatarFallback className="text-xs">
                                      {transaction.client.full_name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm text-gray-500">
                                    {transaction.client.full_name}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-semibold ${
                              transaction.type === "earning" || transaction.type === "refund"
                                ? "text-green-600"
                                : "text-gray-900"
                            }`}>
                              {transaction.type === "earning" || transaction.type === "refund" ? "+" : "-"}
                              ${transaction.amount.toLocaleString()}
                            </p>
                            <Badge className={statusConfig.color}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusConfig.label}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View All Transactions
                  </Button>
                </TabsContent>
                <TabsContent value="earnings" className="mt-4">
                  <div className="space-y-4">
                    {transactions
                      .filter((t) => t.type === "earning")
                      .map((transaction) => {
                        const typeConfig = transactionTypeConfig[transaction.type];
                        const statusConfig = transactionStatusConfig[transaction.status];
                        const TypeIcon = typeConfig.icon;
                        const StatusIcon = statusConfig.icon;

                        return (
                          <div
                            key={transaction.id}
                            className="flex items-center justify-between p-4 border rounded-lg"
                          >
                            <div className="flex items-center gap-4">
                              <div className={`p-2 rounded-full ${typeConfig.bgColor}`}>
                                <TypeIcon className={`h-5 w-5 ${typeConfig.color}`} />
                              </div>
                              <div>
                                <p className="font-medium">{transaction.description}</p>
                                <p className="text-sm text-gray-500">
                                  {new Date(transaction.date).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-green-600">
                                +${transaction.amount.toLocaleString()}
                              </p>
                              <Badge className={statusConfig.color}>
                                {statusConfig.label}
                              </Badge>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </TabsContent>
                <TabsContent value="withdrawals" className="mt-4">
                  <div className="space-y-4">
                    {transactions
                      .filter((t) => t.type === "withdrawal")
                      .map((transaction) => {
                        const typeConfig = transactionTypeConfig[transaction.type];
                        const statusConfig = transactionStatusConfig[transaction.status];
                        const TypeIcon = typeConfig.icon;
                        const StatusIcon = statusConfig.icon;

                        return (
                          <div
                            key={transaction.id}
                            className="flex items-center justify-between p-4 border rounded-lg"
                          >
                            <div className="flex items-center gap-4">
                              <div className={`p-2 rounded-full ${typeConfig.bgColor}`}>
                                <TypeIcon className={`h-5 w-5 ${typeConfig.color}`} />
                              </div>
                              <div>
                                <p className="font-medium">{transaction.description}</p>
                                <p className="text-sm text-gray-500">
                                  {new Date(transaction.date).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">
                                -${transaction.amount.toLocaleString()}
                              </p>
                              <Badge className={statusConfig.color}>
                                {statusConfig.label}
                              </Badge>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Payment Methods */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Manage your withdrawal methods</CardDescription>
              </div>
              <Dialog open={addPaymentDialogOpen} onOpenChange={setAddPaymentDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Payment Method</DialogTitle>
                    <DialogDescription>
                      Add a new withdrawal method
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Method Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bank">Bank Account</SelectItem>
                          <SelectItem value="fastpay">FastPay</SelectItem>
                          <SelectItem value="qi">Qi Card</SelectItem>
                          <SelectItem value="zaincash">ZainCash</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Account Name</Label>
                      <Input placeholder="Enter account name" />
                    </div>
                    <div className="space-y-2">
                      <Label>Account Number / Email</Label>
                      <Input placeholder="Enter details" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setAddPaymentDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddPaymentMethod}>Add Method</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {method.type === "bank" && <Building2 className="h-5 w-5" />}
                      {method.type === "fastpay" && <CreditCard className="h-5 w-5" />}
                      {method.type === "wise" && <CreditCard className="h-5 w-5" />}
                      {method.type === "paypal" && <CreditCard className="h-5 w-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{method.name}</p>
                        {method.is_default && (
                          <Badge variant="secondary" className="text-xs">Default</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{method.details}</p>
                    </div>
                  </div>
                  {!method.is_default && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSetDefault(method.id)}
                    >
                      Set Default
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Total Withdrawn</span>
                <span className="font-semibold">${stats?.total_withdrawn.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Last Month</span>
                <span className="font-semibold">${stats?.last_month.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Avg. per Project</span>
                <span className="font-semibold">$1,437</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Platform Fee Rate</span>
                <span className="font-semibold">5%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
