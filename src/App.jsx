import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Routes, Route, NavLink, Navigate } from "react-router-dom"
import toast, { Toaster } from "react-hot-toast"
import axios from "axios"
import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart3,
  Settings,
  Plus,
  Search,
  MoreHorizontal,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const revenueData = [
  { month: "Jan", revenue: 8200 },
  { month: "Feb", revenue: 11400 },
  { month: "Mar", revenue: 9600 },
  { month: "Apr", revenue: 15200 },
  { month: "May", revenue: 18400 },
  { month: "Jun", revenue: 22100 },
]

const startingInvoices = [
  {
    client: "Gateway Rock Design",
    email: "hello@gatewayrock.com",
    amount: "$2,500",
    status: "Pending",
    due: "May 18",
  },
  {
    client: "Golden Life Adult Care",
    email: "admin@goldenlife.com",
    amount: "$1,700",
    status: "Paid",
    due: "May 22",
  },
  {
    client: "PMP Inc Professionals",
    email: "contact@pmpinc.com",
    amount: "$6,000",
    status: "Paid",
    due: "May 30",
  },
  {
    client: "Velvet Haus Studio",
    email: "billing@velvethaus.com",
    amount: "$3,200",
    status: "Overdue",
    due: "May 10",
  },
]

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Invoices", path: "/invoices", icon: FileText },
  { name: "Clients", path: "/clients", icon: Users },
  { name: "Analytics", path: "/analytics", icon: BarChart3 },
  { name: "Settings", path: "/settings", icon: Settings },
]

const API_URL = "http://localhost:5000/api/invoices"
const AUTH_URL = "http://localhost:5000/api/auth"



function App() {
  const [filter, setFilter] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [editingIndex, setEditingIndex] = useState(null)
  const [user, setUser] = useState(() => {
  const savedUser = localStorage.getItem("invoiceflow-user")
  return savedUser ? JSON.parse(savedUser) : null
 
})

const [token, setToken] = useState(() => {
  return localStorage.getItem("invoiceflow-token") || null
})

const [authMode, setAuthMode] = useState("login")

const [authForm, setAuthForm] = useState({
  name: "",
  email: "",
  password: "",
})

  const [invoiceList, setInvoiceList] = useState(() => {
    const savedInvoices = localStorage.getItem("invoiceflow-invoices")
    return savedInvoices ? JSON.parse(savedInvoices) : startingInvoices
  })

  const [newInvoice, setNewInvoice] = useState({
    client: "",
    email: "",
    amount: "",
    status: "Pending",
    due: "",
  })

 useEffect(() => {
  const fetchInvoices = async () => {
    try {
      const response = await axios.get(API_URL)
      setInvoiceList(response.data)
    } catch (error) {
      console.error("Failed to fetch invoices:", error)
    }
  }

  fetchInvoices()
}, [])

  const filteredInvoices = invoiceList.filter((invoice) => {
  const matchesStatus = filter === "All" || invoice.status === filter

  const matchesSearch =
    invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.email.toLowerCase().includes(searchTerm.toLowerCase())

  return matchesStatus && matchesSearch
})

  const statusStyles = {
    Paid: "bg-green-500/25 text-green-200 border border-green-400/40",
    Pending: "bg-yellow-500/25 text-yellow-100 border border-yellow-400/40",
    Overdue: "bg-red-500/25 text-red-200 border border-red-400/40",
  }

  const resetForm = () => {
    setNewInvoice({
      client: "",
      email: "",
      amount: "",
      status: "Pending",
      due: "",
    })
    setEditingIndex(null)
    setShowModal(false)
  }

  const openCreateModal = () => {
    setEditingIndex(null)
    setNewInvoice({
      client: "",
      email: "",
      amount: "",
      status: "Pending",
      due: "",
    })
    setShowModal(true)
  }
const handleSaveInvoice = async () => {
  if (
    !newInvoice.client ||
    !newInvoice.email ||
    !newInvoice.amount ||
    !newInvoice.due
  ) {
    return
  }

  try {
    if (editingIndex !== null) {
      const invoiceId = invoiceList[editingIndex]._id

      const response = await axios.put(`${API_URL}/${invoiceId}`, newInvoice)

      const updatedInvoices = [...invoiceList]
      updatedInvoices[editingIndex] = response.data
      setInvoiceList(updatedInvoices)

      toast.success("Invoice updated")
    } else {
      const response = await axios.post(API_URL, newInvoice)

      setInvoiceList([response.data, ...invoiceList])

      toast.success("Invoice created")
    }

    resetForm()
  } catch (error) {
    console.error("Failed to save invoice:", error)
    toast.error("Something went wrong")
  }
}

const handleAuth = async () => {
  try {
    const endpoint = authMode === "login" ? "login" : "register"

    const payload =
      authMode === "login"
        ? {
            email: authForm.email,
            password: authForm.password,
          }
        : authForm

    const response = await axios.post(`${AUTH_URL}/${endpoint}`, payload)

    localStorage.setItem("invoiceflow-token", response.data.token)
    localStorage.setItem("invoiceflow-user", JSON.stringify(response.data.user))

    setToken(response.data.token)
    setUser(response.data.user)

    toast.success(authMode === "login" ? "Welcome back" : "Account created")
  } catch (error) {
    console.error("Auth failed:", error)
    toast.error("Authentication failed")
  }
}


  const dashboardContent = (
    <div className="relative z-10">
      <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#DFD9D7]/70">
            Dashboard
          </p>
          <h2 className="mt-2 text-4xl font-black tracking-tight md:text-5xl">
            Welcome back, Lauren
          </h2>
          <p className="mt-2 text-slate-400">
            Track revenue, clients, and invoice activity in one place.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 rounded-2xl bg-[#DFD9D7] px-5 py-3 font-bold text-[#071A2E] shadow-lg shadow-black/20 transition hover:bg-white"
        >
          <Plus size={18} />
          Create Invoice
        </button>
      </div>

      <div className="mb-6 rounded-3xl border border-white/10 bg-white/[0.05] p-5 lg:hidden">
        <h1 className="text-3xl font-black">
          Invoice<span className="text-[#DFD9D7]">Flow</span>
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Premium invoicing dashboard
        </p>
      </div>

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total Revenue",
            value: "$48,290",
            icon: TrendingUp,
            detail: "+18.2% this month",
          },
          {
            label: "Paid Invoices",
            value: "28",
            icon: CheckCircle2,
            detail: "$12,400 collected",
          },
          {
            label: "Pending",
            value: "12",
            icon: Clock,
            detail: "$8,900 outstanding",
          },
          {
            label: "Overdue",
            value: "3",
            icon: AlertCircle,
            detail: "Follow-up needed",
          },
        ].map((card, index) => {
          const Icon = card.icon

          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -5 }}
              className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-[0_0_40px_rgba(0,0,0,0.25)] backdrop-blur-xl"
            >
              <div className="mb-5 flex items-center justify-between">
                <p className="text-sm text-slate-400">{card.label}</p>
                <div className="rounded-2xl bg-white/10 p-3 text-[#DFD9D7]">
                  <Icon size={20} />
                </div>
              </div>

              <h3 className="text-4xl font-black">{card.value}</h3>
              <p className="mt-3 text-sm text-slate-400">{card.detail}</p>
            </motion.div>
          )


        })}
      </section>

      <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">Revenue Overview</h3>
              <p className="mt-1 text-sm text-slate-400">
                Monthly invoice revenue performance
              </p>
            </div>
            <span className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-sm text-green-300">
              +24%
            </span>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    background: "#071A2E",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "16px",
                    color: "#fff",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#DFD9D7"
                  fill="#DFD9D7"
                  fillOpacity={0.18}
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl">
          <h3 className="text-2xl font-bold">Recent Activity</h3>
          <p className="mt-1 text-sm text-slate-400">Latest billing updates</p>

          <div className="mt-6 space-y-4">
            {[
              "Invoice #1048 was marked paid",
              "New client added: Velvet Haus Studio",
              "Reminder sent to Gateway Rock Design",
              "Overdue invoice flagged for follow-up",
            ].map((activity) => (
              <div
                key={activity}
                className="rounded-2xl border border-white/10 bg-black/10 p-4 text-sm text-slate-300"
              >
                {activity}
              </div>
            ))}
          </div>
        </div>
      </section>

         </div>
  )

const invoicesContent = (
  <div className="relative z-10">
    <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#DFD9D7]/70">
          Invoices
        </p>

        <h2 className="mt-2 text-4xl font-black tracking-tight md:text-5xl">
          Invoice Management
        </h2>

        <p className="mt-2 text-slate-400">
          Manage all invoices, payment statuses, and client billing.
        </p>
      </div>

      <button
        onClick={openCreateModal}
        className="flex items-center justify-center gap-2 rounded-2xl bg-[#DFD9D7] px-5 py-3 font-bold text-[#071A2E] shadow-lg shadow-black/20 transition hover:bg-white"
      >
        <Plus size={18} />
        Create Invoice
      </button>
    </div>

    <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-xl">
      <div className="flex flex-col gap-5 border-b border-white/10 p-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-2xl font-bold">Recent Invoices</h3>

          <p className="mt-1 text-sm text-slate-400">
            Manage invoice status, payment tracking, and client records.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/10 px-4 py-3">
            <Search size={17} className="text-slate-400" />

            <input
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {["All", "Paid", "Pending", "Overdue"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  filter === status
                    ? "bg-[#DFD9D7] text-[#071A2E]"
                    : "bg-white/10 text-slate-300 hover:bg-white/15"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px]">
          <thead className="border-b border-white/10 text-left text-sm text-slate-400">
            <tr>
              <th className="p-5">Client</th>
              <th className="p-5">Amount</th>
              <th className="p-5">Status</th>
              <th className="p-5">Due Date</th>
              <th className="p-5 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredInvoices.map((invoice) => (
              <tr
                key={`${invoice.client}-${invoice.email}-${invoice.due}`}
                className="border-b border-white/5 transition hover:bg-white/[0.03]"
              >
                <td className="p-5">
                  <p className="font-semibold">{invoice.client}</p>

                  <p className="mt-1 text-sm text-slate-400">
                    {invoice.email}
                  </p>
                </td>

                <td className="p-5 font-bold text-[#DFD9D7]">
                  {invoice.amount}
                </td>

                <td className="p-5">
                  <span
                    className={`rounded-full px-3 py-1 text-sm ${
                      statusStyles[invoice.status]
                    }`}
                  >
                    {invoice.status}
                  </span>
                </td>

                <td className="p-5 text-slate-400">{invoice.due}</td>

                <td className="p-5">
                  <div className="flex justify-end gap-2">
                    <button className="rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/15">
                      View
                    </button>

                    <button
                      onClick={() => {
                        const originalIndex = invoiceList.findIndex(
                          (item) => item._id === invoice._id
                        )

                        setEditingIndex(originalIndex)
                        setNewInvoice(invoice)
                        setShowModal(true)
                      }}
                      className="rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/15"
                    >
                      Edit
                    </button>

                    <button
                      onClick={async () => {
                        try {
                          await axios.delete(`${API_URL}/${invoice._id}`)

                          setInvoiceList(
                            invoiceList.filter(
                              (item) => item._id !== invoice._id
                            )
                          )

                          toast.success("Invoice deleted")
                        } catch (error) {
                          console.error(
                            "Failed to delete invoice:",
                            error
                          )

                          toast.error("Could not delete invoice")
                        }
                      }}
                      className="rounded-xl bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/20"
                    >
                      Delete
                    </button>

                    <button className="rounded-xl bg-white/10 p-2 text-slate-300 transition hover:bg-white/15">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  </div>
)



if (!token || !user) {
  return (
    <div className="min-h-screen bg-[#071A2E] text-white flex items-center justify-center p-6">
      <Toaster position="top-right" />

      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.06] p-8 backdrop-blur-xl">
        <h1 className="text-4xl font-black">
          Invoice<span className="text-[#DFD9D7]">Flow</span>
        </h1>

        <p className="mt-2 text-slate-400">
          {authMode === "login"
            ? "Login to your workspace."
            : "Create your workspace account."}
        </p>

        <div className="mt-8 space-y-4">
          {authMode === "register" && (
            <input
              placeholder="Name"
              value={authForm.name}
              onChange={(e) =>
                setAuthForm({ ...authForm, name: e.target.value })
              }
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 outline-none focus:border-[#DFD9D7]"
            />
          )}

          <input
            placeholder="Email"
            value={authForm.email}
            onChange={(e) =>
              setAuthForm({ ...authForm, email: e.target.value })
            }
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 outline-none focus:border-[#DFD9D7]"
          />

          <input
            type="password"
            placeholder="Password"
            value={authForm.password}
            onChange={(e) =>
              setAuthForm({ ...authForm, password: e.target.value })
            }
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 outline-none focus:border-[#DFD9D7]"
          />

          <button
            onClick={handleAuth}
            className="w-full rounded-2xl bg-[#DFD9D7] py-4 font-bold text-[#071A2E] transition hover:bg-white"
          >
            {authMode === "login" ? "Login" : "Create Account"}
          </button>



<button
  onClick={() =>
    setAuthMode(authMode === "login" ? "register" : "login")
  }
  className="w-full text-sm text-slate-400 hover:text-white"
></button>

          <button
            onClick={() =>
              setAuthMode(authMode === "login" ? "register" : "login")
            }
            className="w-full text-sm text-slate-400 hover:text-white"
          >
            {authMode === "login"
              ? "Need an account? Register"
              : "Already have an account? Login"}
          </button>

<button
  onClick={() => {
    const demoUser = {
      id: "demo-user",
      name: "Demo User",
      email: "demo@invoiceflow.com",
    }

    localStorage.setItem("invoiceflow-token", "demo-token")
    localStorage.setItem(
      "invoiceflow-user",
      JSON.stringify(demoUser)
    )

    setToken("demo-token")
    setUser(demoUser)

    toast.success("Demo mode activated")
  }}
  className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 font-bold text-slate-200 transition hover:bg-white/10"
>
  Use Demo Login
</button>

        </div>
      </div>
    </div>
  )
}

  return (
    <div className="min-h-screen bg-[#071A2E] text-white">
      <Toaster position="top-right" />
      <div className="flex min-h-screen">
        <aside className="hidden w-72 flex-col border-r border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl lg:flex">
          <div className="mb-10">
            <h1 className="text-3xl font-black tracking-tight">
              Invoice<span className="text-[#DFD9D7]">Flow</span>
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Premium invoicing dashboard
            </p>
          </div>
          

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                      isActive
                        ? "bg-[#DFD9D7] text-[#071A2E]"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  <Icon size={18} />
                  {item.name}
                </NavLink>
              )
            })}
                   </nav>

          <button
            onClick={() => {
              localStorage.removeItem("invoiceflow-token")
              localStorage.removeItem("invoiceflow-user")
              setToken(null)
              setUser(null)
              toast.success("Logged out")
            }}
            className="mt-6 rounded-2xl bg-red-500/10 px-4 py-3 text-sm font-bold text-red-300 transition hover:bg-red-500/20"
          >
            Logout
          </button>

          <div className="mt-auto rounded-3xl border border-white/10 bg-white/[0.05] p-5">
            <p className="text-sm font-semibold">Pro Plan</p>
            <p className="mt-2 text-sm text-slate-400">
              Manage unlimited clients, invoices, and monthly reports.
            </p>
           <button
  onClick={() => setShowUpgradeModal(true)}
  className="mt-4 w-full rounded-2xl bg-[#71869A] px-4 py-3 text-sm font-bold text-black transition hover:bg-[#DFD9D7]"
>
  Upgrade
</button>
          </div>
          </aside>

          <div className="fixed bottom-4 left-1/2 z-50 flex w-[92%] -translate-x-1/2 items-center justify-between rounded-3xl border border-white/10 bg-[#071A2E]/90 p-2 shadow-2xl backdrop-blur-xl lg:hidden">
  {navItems.map((item) => {
    const Icon = item.icon

    return (
      <NavLink
        key={item.name}
        to={item.path}
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 rounded-2xl px-3 py-2 text-xs font-semibold transition ${
            isActive
              ? "bg-[#DFD9D7] text-[#071A2E]"
              : "text-slate-300 hover:bg-white/10 hover:text-white"
          }`
        }
      >
        <Icon size={18} />
        <span className="hidden sm:block">{item.name}</span>
      </NavLink>
    )
  })}
</div>

        <main className="flex-1 overflow-hidden">
          <div className="relative min-h-screen p-5 pb-28 md:p-8 md:pb-28 lg:p-10">
            <div className="pointer-events-none absolute left-0 top-0 h-96 w-96 rounded-full bg-blue-500/10 blur-[140px]" />
            <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[#DFD9D7]/10 blur-[140px]" />

<Routes>
  <Route path="/" element={<Navigate to="/dashboard" replace />} />

  <Route path="/dashboard" element={dashboardContent} />

  <Route path="/invoices" element={invoicesContent} />

<Route
  path="/clients"
  element={
    <div className="relative z-10">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#DFD9D7]/70">
          Clients
        </p>
        <h2 className="mt-2 text-4xl font-black tracking-tight md:text-5xl">
          Client Directory
        </h2>
        <p className="mt-2 text-slate-400">
          View client profiles connected to invoice records.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {invoiceList.map((invoice) => (
          <div
            key={`${invoice.client}-${invoice.email}`}
            className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl"
          >
            <h3 className="text-2xl font-bold">{invoice.client}</h3>
            <p className="mt-2 text-slate-400">{invoice.email}</p>

            <div className="mt-6 flex items-center justify-between">
              <span className="text-sm text-slate-400">Latest invoice</span>
              <span className="font-bold text-[#DFD9D7]">{invoice.amount}</span>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-slate-400">Status</span>
              <span
                className={`rounded-full px-3 py-1 text-sm ${
                  statusStyles[invoice.status]
                }`}
              >
                {invoice.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  }
/>

                
              
             <Route
  path="/analytics"
  element={
    <div className="relative z-10">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#DFD9D7]/70">
          Analytics
        </p>
        <h2 className="mt-2 text-4xl font-black tracking-tight md:text-5xl">
          Revenue Analytics
        </h2>
        <p className="mt-2 text-slate-400">
          Track revenue performance, payment status, and outstanding balances.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl">
          <h3 className="text-2xl font-bold">Monthly Revenue</h3>
          <p className="mt-1 text-sm text-slate-400">
            Invoice revenue trends over time.
          </p>

          <div className="mt-8 h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    background: "#071A2E",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "16px",
                    color: "#fff",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#DFD9D7"
                  fill="#DFD9D7"
                  fillOpacity={0.18}
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl">
            <p className="text-sm text-slate-400">Total Invoices</p>
            <h3 className="mt-3 text-4xl font-black">{invoiceList.length}</h3>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl">
            <p className="text-sm text-slate-400">Paid</p>
            <h3 className="mt-3 text-4xl font-black text-green-300">
              {invoiceList.filter((invoice) => invoice.status === "Paid").length}
            </h3>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl">
            <p className="text-sm text-slate-400">Pending / Overdue</p>
            <h3 className="mt-3 text-4xl font-black text-yellow-200">
              {
                invoiceList.filter(
                  (invoice) =>
                    invoice.status === "Pending" || invoice.status === "Overdue"
                ).length
              }
            </h3>
          </div>
        </div>
      </div>
    </div>
  }
/>
                
            <Route
  path="/settings"
  element={
    <div className="relative z-10">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#DFD9D7]/70">
          Settings
        </p>
        <h2 className="mt-2 text-4xl font-black tracking-tight md:text-5xl">
          Business Settings
        </h2>
        <p className="mt-2 text-slate-400">
          Manage profile, invoice preferences, and workspace details.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl">
          <h3 className="text-2xl font-bold">Business Profile</h3>
          <p className="mt-1 text-sm text-slate-400">
            These details would appear on generated invoices.
          </p>

          <div className="mt-6 space-y-4">
            <input
              placeholder="Business Name"
              defaultValue="InvoiceFlow Studio"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 outline-none focus:border-[#DFD9D7]"
            />

            <input
              placeholder="Business Email"
              defaultValue="hello@invoiceflow.com"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 outline-none focus:border-[#DFD9D7]"
            />

            <input
              placeholder="Default Currency"
              defaultValue="USD"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 outline-none focus:border-[#DFD9D7]"
            />

            <button className="w-full rounded-2xl bg-[#DFD9D7] py-4 font-bold text-[#071A2E] transition hover:bg-white">
              Save Settings
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl">
          <h3 className="text-2xl font-bold">Invoice Preferences</h3>
          <p className="mt-1 text-sm text-slate-400">
            Configure invoice defaults.
          </p>

          <div className="mt-6 space-y-4">
            {[
              "Auto-send payment reminders",
              "Show business branding on invoices",
              "Include late payment note",
              "Enable monthly revenue summaries",
            ].map((setting) => (
              <div
                key={setting}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/10 p-4"
              >
                <span className="text-sm text-slate-300">{setting}</span>
                <span className="rounded-full bg-[#DFD9D7] px-3 py-1 text-xs font-bold text-[#071A2E]">
                  On
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  }
/>
            </Routes>
          </div>

          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
              <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#071A2E] p-8 shadow-2xl">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-black">
                      {editingIndex !== null
                        ? "Edit Invoice"
                        : "Create Invoice"}
                    </h2>

                    <p className="mt-1 text-slate-400">
                      {editingIndex !== null
                        ? "Update the invoice details below."
                        : "Add a new invoice to your dashboard."}
                    </p>
                  </div>

                  <button
                    onClick={resetForm}
                    className="rounded-xl bg-white/10 px-3 py-2 hover:bg-white/20"
                  >
                    X
                  </button>
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Client Name"
                    value={newInvoice.client}
                    onChange={(e) =>
                      setNewInvoice({
                        ...newInvoice,
                        client: e.target.value,
                      })
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 outline-none focus:border-[#DFD9D7]"
                  />

                  <input
                    type="email"
                    placeholder="Client Email"
                    value={newInvoice.email}
                    onChange={(e) =>
                      setNewInvoice({
                        ...newInvoice,
                        email: e.target.value,
                      })
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 outline-none focus:border-[#DFD9D7]"
                  />

                  <input
                    type="text"
                    placeholder="Invoice Amount"
                    value={newInvoice.amount}
                    onChange={(e) =>
                      setNewInvoice({
                        ...newInvoice,
                        amount: e.target.value,
                      })
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 outline-none focus:border-[#DFD9D7]"
                  />

                  <input
                    type="text"
                    placeholder="Due Date"
                    value={newInvoice.due}
                    onChange={(e) =>
                      setNewInvoice({
                        ...newInvoice,
                        due: e.target.value,
                      })
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 outline-none focus:border-[#DFD9D7]"
                  />

                  <select
                    value={newInvoice.status}
                    onChange={(e) =>
                      setNewInvoice({
                        ...newInvoice,
                        status: e.target.value,
                      })
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none focus:border-[#DFD9D7]"
                  >
                    <option>Pending</option>
                    <option>Paid</option>
                    <option>Overdue</option>
                  </select>

                  <button
                    onClick={handleSaveInvoice}
                    className="w-full rounded-2xl bg-[#DFD9D7] py-4 font-bold text-[#071A2E] transition hover:bg-white"
                  >
                    {editingIndex !== null ? "Update Invoice" : "Save Invoice"}
                  </button>
                </div>
              </div>
            </div>
          )}

{showUpgradeModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
    <div className="w-full max-w-5xl rounded-3xl border border-white/10 bg-[#071A2E] p-8 shadow-2xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#DFD9D7]/70">
            Upgrade
          </p>
          <h2 className="mt-2 text-4xl font-black">Choose Your Plan</h2>
          <p className="mt-2 text-slate-400">
            Unlock more invoice capacity, analytics, and premium automation.
          </p>
        </div>

        <button
          onClick={() => setShowUpgradeModal(false)}
          className="rounded-xl bg-white/10 px-3 py-2 hover:bg-white/20"
        >
          X
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {[
          {
            name: "Starter",
            price: "$0",
            badge: "Current Plan",
            features: ["10 invoices", "Basic dashboard", "Client tracking"],
          },
          {
            name: "Pro",
            price: "$19/mo",
            badge: "Popular",
            features: ["Unlimited invoices", "Advanced analytics", "PDF exports", "Payment reminders"],
          },
          {
            name: "Enterprise",
            price: "$49/mo",
            badge: "Scale",
            features: ["Team access", "Priority support", "Custom branding", "Stripe-ready workflow"],
          },
        ].map((plan) => (
          <div
            key={plan.name}
            className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-2xl font-bold">{plan.name}</h3>
              <span className="rounded-full bg-[#DFD9D7] px-3 py-1 text-xs font-bold text-[#071A2E]">
                {plan.badge}
              </span>
            </div>

            <p className="text-4xl font-black text-[#DFD9D7]">{plan.price}</p>

            <div className="mt-6 space-y-3">
              {plan.features.map((feature) => (
                <p key={feature} className="text-sm text-slate-300">
                  ✓ {feature}
                </p>
              ))}
            </div>

            <button className="mt-8 w-full rounded-2xl bg-white/10 py-3 font-bold text-slate-200 transition hover:bg-[#DFD9D7] hover:text-[#071A2E]">
              {plan.name === "Starter" ? "Current Plan" : "Upgrade Coming Soon"}
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
)}

        </main>
      </div>
    </div>
  )
}

export default App