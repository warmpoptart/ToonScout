using System;
using System.Diagnostics;
using System.IO;
using System.Windows.Forms;

namespace scout
{
    public partial class Form1 : Form
    {
        private Process runningProcess;
        public Form1()
        {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            LoadEnv();
        }

        private void btnRunApp_Click(object sender, EventArgs e)
        {
            btnRunApp.Enabled = false;
            btnStopApp.Enabled = true;

            string appId = txtAppId.Text;
            string discordToken = txtDiscordToken.Text;
            string publicKey = txtPublicKey.Text;
            string subdomain = txtSubdomain.Text;

            // save config
            string content = $"APP_ID={appId}\nDISCORD_TOKEN={discordToken}\nPUBLIC_KEY={publicKey}\nSUBDOMAIN={subdomain}";
            File.WriteAllText(".env", content);
            RunStartup();
        }
        private void btnStopApp_Click(object sender, EventArgs e)
        {
            logFile.WriteLine("Stopping the application at " + DateTime.Now);
            logFile.Flush();
            StopStartup();
        }


        private StreamWriter logFile; // Class-level field to store the StreamWriter

        private void RunStartup()
        {
            string appDirectory = AppDomain.CurrentDomain.BaseDirectory;
            string logPath = Path.Combine(appDirectory, "logs", "runScout.log");

            // clear logfile
            if (File.Exists(logPath))
            {
                File.Delete(logPath);
            }

            string scriptPath = Path.Combine(appDirectory, "runScout.bat");

            Directory.CreateDirectory(Path.Combine(appDirectory, "logs")); // Ensure logs directory exists

            ProcessStartInfo processInfo = new ProcessStartInfo
            {
                FileName = "cmd.exe",
                Arguments = $"/c \"\"{scriptPath}\" {txtSubdomain.Text}\"",
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };

            runningProcess = Process.Start(processInfo);

            // Create the StreamWriter outside the using block
            logFile = new StreamWriter(logPath, append: true);
            logFile.WriteLine("Starting the application at " + DateTime.Now);
            logFile.Flush();

            runningProcess.OutputDataReceived += (sender, args) =>
            {
                if (!string.IsNullOrEmpty(args.Data))
                {
                    logFile.WriteLine(args.Data);
                    logFile.Flush(); // Ensure the data is written immediately
                }
            };

            runningProcess.ErrorDataReceived += (sender, args) =>
            {
                if (!string.IsNullOrEmpty(args.Data))
                {
                    logFile.WriteLine("ERROR: " + args.Data);
                    logFile.Flush(); // Ensure the error is written immediately
                }
            };

            runningProcess.BeginOutputReadLine();
            runningProcess.BeginErrorReadLine();
        }
        private void StopStartup()
        {
            if (runningProcess != null && !runningProcess.HasExited)
            {
                runningProcess.Kill();
                runningProcess.WaitForExit(); // Optional: wait for the process to exit
                runningProcess = null;
            }

            // Also terminate any other related processes (Node.js and LocalTunnel)
            KillProcessByName("node");
            KillProcessByName("lt");

            btnRunApp.Enabled = true;
            btnStopApp.Enabled = false;

            // Close the log file if it's still open
            logFile?.Close();
            logFile = null; // Prevent further access

            // Log a message to the log file
        }

    private void KillProcessByName(string processName)
    {
        var processes = Process.GetProcessesByName(processName);
        foreach (var process in processes)
        {
            process.Kill();
            process.WaitForExit(); // Optional: wait for the process to exit
        }
    }

    private void LoadEnv()
        {
            btnStopApp.Enabled = false;
            string filePath = ".env";

            if (File.Exists(filePath))
            {
                string[] lines = File.ReadAllLines(filePath);

                foreach (var line in lines)
                {
                    var keyValue = line.Split('=');
                    if (keyValue.Length == 2)
                    {
                        string key = keyValue[0].Trim();
                        string value = keyValue[1].Trim();

                        if (key == "APP_ID")
                        {
                            txtAppId.Text = value;
                        }
                        else if (key == "DISCORD_TOKEN")
                        {
                            txtDiscordToken.Text = value;
                        }
                        else if (key == "PUBLIC_KEY")
                        {
                            txtPublicKey.Text = value;
                        } 
                        else if (key == "SUBDOMAIN")
                        {
                            txtSubdomain.Text = value;
                        }
                    }
                }
            }
        }

        private void Form1_FormClosing(object sender, FormClosingEventArgs e)
        {
            StopStartup();
        }
    }
}
