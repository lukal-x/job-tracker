
const   StatsNav = ({ range, onChange }: { range: any, onChange: (e: any) => void }) => {
  return (
    <section className='flex bg-white dark:bg-sidebar p-5 rounded-lg w-full justify-between'>
        <div className="grid p-1">
          <h1 className="font-bold text-2xl">Statistics</h1>
          <p className="text-muted-foreground text-sm">Track your job search metrics and progress</p>
        </div>
            <div className='flex gap-2 items-center'>
                <select
                    className="border-2 bg-accent rounded-md px-3 py-2"
                    value={range}
                    onChange={onChange}
                    >
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                </select>
            </div>
    </section>
  )
}

export default StatsNav