Module Main

    Sub Main()
        'Dim a As String = Console.ReadLine("Please Specify Path")
        Dim apppath As String = System.IO.Path.GetDirectoryName(Environment.GetCommandLineArgs(0)).ToString
        Console.WriteLine("App Startup Path: " + apppath)
        Dim num As Integer = 1
        Dim pathstring As String = (apppath & "\" & "element" & num & ".txt")

        Dim tf As Boolean = True
        While tf = True
            Console.WriteLine("Checking " & pathstring)
            If System.IO.File.Exists(pathstring) = True Then
                num += 1
                pathstring = (apppath & "\" & "element" & num & ".txt")
            Else
                tf = False
            End If
        End While

        num -= 1

        Console.WriteLine("Num of Files Detected: " & num)
        Dim currentnum As Integer = 1
        Dim OutputString As String = Nothing
        Dim pathstring2 As String = (apppath & "\" & "element" & currentnum & ".txt")

        While currentnum < num + 1
            Console.WriteLine("Adding " + pathstring2)
            If OutputString = Nothing Then
                OutputString += My.Computer.FileSystem.ReadAllText(pathstring2)

            Else
                OutputString += "," + My.Computer.FileSystem.ReadAllText(pathstring2)
            End If

            currentnum += 1
            pathstring2 = (apppath & "\" & "element" & currentnum & ".txt")
        End While
        Console.WriteLine(OutputString)
        Console.WriteLine("Saving...")

        My.Computer.FileSystem.WriteAllText(apppath & "\" & "EleResult.txt", OutputString, False)
        Console.WriteLine("Done")
        Console.WriteLine("Do you want to open? Enter y.")

        Dim EndResult As String = Console.ReadLine()
        If EndResult = "Y" Or EndResult = "y" Then
            System.Diagnostics.Process.Start(apppath & "\" & "EleResult.txt")
        End If
    End Sub

End Module
