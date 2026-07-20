use std::{env, io::{self, BufRead, BufReader}, process::{Command, Stdio}};

fn main() -> io::Result<()> {
    let command = env::args().nth(1).unwrap_or_else(|| "start".to_owned());
    match command.as_str() {
        "start" => start(),
        "status" => { println!("Quick Tunnel status is process-scoped. Run the start command to begin one."); Ok(()) }
        "help" | "--help" => { println!("Usage: cargo run --bin deskclerk-tunnel -- <start|status>"); Ok(()) }
        other => { eprintln!("Unknown tunnel command: {other}"); std::process::exit(2); }
    }
}

fn start() -> io::Result<()> {
    let cloudflared = env::var("CLOUDFLARED_BIN").unwrap_or_else(|_| "cloudflared".to_owned());
    let mut child = Command::new(&cloudflared).args(["tunnel", "--url", "http://127.0.0.1:8787"]).stdout(Stdio::piped()).stderr(Stdio::piped()).spawn().map_err(|error| io::Error::new(error.kind(), format!("Unable to start cloudflared ({cloudflared:?}). Install cloudflared or set CLOUDFLARED_BIN. {error}")))?;
    println!("Starting free Cloudflare Quick Tunnel for http://127.0.0.1:8787…");
    if let Some(stdout) = child.stdout.take() { for line in BufReader::new(stdout).lines() { let line=line?; if line.contains("trycloudflare.com") { println!("Tunnel URL: {line}"); } else if !line.is_empty() { println!("cloudflared: {line}"); } } }
    let status = child.wait()?; if !status.success() { eprintln!("cloudflared exited with {status}"); } Ok(())
}
