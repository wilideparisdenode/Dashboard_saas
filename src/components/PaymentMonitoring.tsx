import "./componentStyle.css";
type Props = {}

function PaymentMonitoring({}: Props) {
  return (
    <div className="payment_monitoring">
        <h1>Payment monitoring</h1>
        <div className="stats_container">
            <div className="filter_panel">
                <input className="id_filter" placeholder="fileter:id"></input>
                <input type="text" className="email_user_filter" placeholder=" username/email" />
                <select name="" id="status">
                    status
                    <option value="">
                        all
                    </option>
                    <option value="">
                        sucess
                    </option>
                    <option value="">failed</option>
                    <option value="">pending</option>
                </select>
                 <select name="" id="method">
                    card
                    <option value="">
                        bank
                    </option>
                    <option value="">
                       wallet
                    </option>
                </select>
                 <select name="" id="provider">
                    provider:
                    <option value="
                    ">
                         stripe
                    </option>
                   
                    <option value="">
                        paypal
                    </option>
                    <option value="">
                        other
                    </option>
                    
                </select>
                <div className="date_range_container">
                    <select name="" id="date_range">
                   date_Range
                    <option value="
                    ">
                        today
                    </option>     
                </select>
                <input type="date" name="" id="" />
                </div>
                 
            </div>
                        <div className="matrixpanel">
                            <section><h3>total payment today</h3> <p>2000cfa</p></section>
                            <section><h3>success rate</h3><p>40%</p></section>
                            <section><h3>refund count</h3><p>30</p></section>
                            <section><h3>failed payments</h3><p>7</p></section>
                        </div>

        </div>
    </div>
  )
}

export default PaymentMonitoring