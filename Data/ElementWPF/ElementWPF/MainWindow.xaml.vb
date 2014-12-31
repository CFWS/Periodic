Imports System.Text.RegularExpressions

Class MainWindow
    Dim ArrayMass As New System.Collections.ArrayList
    Dim ArraySymbol As New System.Collections.ArrayList

    Private Sub Window_Loaded(sender As Object, e As RoutedEventArgs)

        Dim AllLinks As MatchCollection = Regex.Matches(My.Resources.index, "(?<=<div class=""elementname"">).*(?=</div>)")
        Dim MassNum As MatchCollection = Regex.Matches(My.Resources.index, "(?<=<div class=""elementmass"">).*(?=</div>)")
        Dim elesymbol As MatchCollection = Regex.Matches(My.Resources.index, "(?<=<div class=""elementsymbol"">).*(?=</div>)")



        'Regex Patter for links
        For Each Link As Match In AllLinks
            elename.Items.Add(Link)
        Next
        For Each Link2 As Match In MassNum
            ArrayMass.Add(Link2.Value.ToString)
        Next
        For Each Link2 As Match In elesymbol
            ArraySymbol.Add(Link2.Value.ToString)
        Next


        Dim num As Integer = 1
        While num < 19
            elegroup.Items.Add(num)
            num += 1
        End While
        num = 1
        While num < 10
            eleperiod.Items.Add(num)
            num += 1
        End While
        elegroup.Items.Add("")
        elegroup.SelectedIndex = 0
        eleperiod.SelectedIndex = 0

        Dim a As Array = {"Non-Metal", "Alkali Metals", "Alkali Earths Metals", "Noble Gas", "Halogens", "Metalloids", "Transition Metals", "Post Transition Metals", "Lanthanides", "Actinides", "Other Metals"}
        For Each item As String In a
            eleclass.Items.Add(item)
        Next

        eleclass.SelectedIndex = 0

        elelocation.Items.Add("s-block")
        elelocation.Items.Add("p-block")
        elelocation.Items.Add("d-block")
        elelocation.Items.Add("f-block")
        elelocation.Items.Add("g-block")
        elelocation.SelectedIndex = 0

        elestate.Items.Add("Gas")
        elestate.Items.Add("Solid")
        elestate.Items.Add("Liquid")
        elestate.Items.Add("Unknown")
        elestate.SelectedIndex = 0


    End Sub


    Private Sub btnSave_Click(sender As Object, e As RoutedEventArgs) Handles btnSave.Click
        txtOutput.Text = """" & TextBox1.Text & """,""" & elename.Text & """," & elenum.Text & "," & elegroup.Text & "," & eleperiod.Text & "," & elemass.Text & ",""" & eleclass.Text & """,""" & elelocation.Text & """,""" & eleshellconfig.Text & """,""" & elesubshellconfig.Text & """,""" & eleion.Text & """,""" & elestate.Text & """,""" & eleboil.Text & """,""" & elemelt.Text & """,""" & eleisotope.Text & """,""" & elediscovery.Text & """,""" & eledescription.Text & """"

        If System.IO.File.Exists(My.Application.Info.DirectoryPath & "/element" & (elename.SelectedIndex + 1) & ".txt") = True Then
            My.Computer.FileSystem.WriteAllText("element" & (elename.SelectedIndex + 1) & ".txt", txtOutput.Text, False)
            Exit Sub
        End If

        Dim filedialog As New Microsoft.Win32.SaveFileDialog
        filedialog.InitialDirectory = My.Application.Info.DirectoryPath
        filedialog.Title = "Locate Save Folder"
        filedialog.AddExtension = True
        filedialog.DefaultExt = ".txt"
        filedialog.FileName = "element" + elenum.Text
        filedialog.ShowDialog()
        My.Computer.FileSystem.WriteAllText(filedialog.FileName, txtOutput.Text, False)
    End Sub

    Private Sub elename_SelectionChanged(sender As Object, e As SelectionChangedEventArgs) Handles elename.SelectionChanged
        If System.IO.File.Exists(My.Application.Info.DirectoryPath & "/element" & (elename.SelectedIndex + 1) & ".txt") = True Then
            'Select Case MessageBox.Show(ArraySymbol(elename.SelectedIndex) + " - File Detected. Load?", "Load File", MessageBoxButton.YesNo, MessageBoxImage.Question)
            'Case Is = MessageBoxResult.Yes
            LoadElement(My.Application.Info.DirectoryPath & "/element" & (elename.SelectedIndex + 1) & ".txt")
            'End Select
        End If
        elenum.Text = elename.SelectedIndex + 1
        elemass.Text = ArrayMass(elename.SelectedIndex)
        TextBox1.Text = ArraySymbol(elename.SelectedIndex)
    End Sub

    Private Sub btnEdit_Click(sender As Object, e As RoutedEventArgs) Handles btnEdit.Click
        Dim filedialog As New Microsoft.Win32.OpenFileDialog
        filedialog.Title = "Locate File"
        filedialog.ShowDialog()
        LoadElement(filedialog.FileName)

    End Sub
    Public Sub LoadElement(File As String)
        Dim a As String = My.Computer.FileSystem.ReadAllText(File)
        If a = Nothing Then
            Exit Sub
        End If

        Dim asplit As String() = a.Split("""")
        elename.Text = asplit(3)
        eleclass.Text = asplit(5)

        elelocation.Text = asplit(7)

        eleshellconfig.Text = asplit(9)
        elesubshellconfig.Text = asplit(11)

        eleion.Text = asplit(13)
        elestate.Text = asplit(15)

        eleboil.Text = asplit(17)
        elemelt.Text = asplit(19)

        eleisotope.Text = asplit(21)
        elediscovery.Text = asplit(23)
        eledescription.Text = asplit(25)

        asplit = a.Split(",")
        elegroup.Text = asplit(3)
        eleperiod.Text = asplit(4)
    End Sub
End Class
